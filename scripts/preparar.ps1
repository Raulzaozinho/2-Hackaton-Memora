# Prepara o computador para a Feira Dev (Windows). Rode pelo preparar.cmd, na raiz do projeto.
#
# 1. Usa o Node e o Java que ja estao instalados, se a versao servir. Se nao servir, baixa um Node 24
#    e um Java 21 para %USERPROFILE%\feira-ferramentas, sem instalar nada no Windows e sem mexer no
#    Node ou no Java que voce usa em outros projetos.
# 2. Grava em feira-ferramentas\caminhos.cmd quais usar; o piloto.cmd le esse arquivo.
# 3. Roda scripts\preparar.mjs, que baixa as dependencias do projeto e confere o resto.
# (Este arquivo fica sem acentos de proposito: o PowerShell do Windows le acentos errado.)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$raiz = Split-Path -Parent $PSScriptRoot
$ferramentas = if ($env:FEIRA_FERRAMENTAS) { $env:FEIRA_FERRAMENTAS } else { Join-Path $env:USERPROFILE 'feira-ferramentas' }
$NODE_ZIP = 'https://nodejs.org/dist/v24.22.3/node-v24.22.3-win-x64.zip'
$JDK_ZIP = 'https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse?project=jdk'

function Titulo($texto) { Write-Host ''; Write-Host "== $texto" -ForegroundColor Cyan }
function Ok($texto) { Write-Host "  OK  $texto" -ForegroundColor Green }

function Baixar-E-Extrair($url, $destino) {
    $zip = Join-Path $env:TEMP ('feira-' + [guid]::NewGuid() + '.zip')
    $temporaria = "$destino-baixando"
    Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
    if (Test-Path $temporaria) { Remove-Item -Recurse -Force $temporaria }
    New-Item -ItemType Directory -Force $temporaria | Out-Null
    $tar = Join-Path $env:SystemRoot 'System32\tar.exe'
    if (Test-Path $tar) { & $tar -xf $zip -C $temporaria } else { Expand-Archive -Path $zip -DestinationPath $temporaria }
    Remove-Item $zip -Force
    # O zip traz uma pasta so (node-v24... ou jdk-21...): ela vira o destino.
    $dentro = Get-ChildItem $temporaria -Directory | Select-Object -First 1
    if (Test-Path $destino) { Remove-Item -Recurse -Force $destino }
    Move-Item $dentro.FullName $destino
    Remove-Item -Recurse -Force $temporaria
}

function Versao-Do-Node($exe) {
    try { $v = (& $exe -v) 2>$null } catch { return $null }
    if (-not $v) { return $null }
    return $v.Trim()
}

function Node-Serve($versao) {
    if (-not $versao) { return $false }
    $p = $versao.TrimStart('v').Split('.') | ForEach-Object { [int]$_ }
    if ($p[0] -eq 22) { return ($p[1] -gt 22) -or ($p[1] -eq 22 -and $p[2] -ge 3) }
    if ($p[0] -eq 24) { return $p[1] -ge 15 }
    return $p[0] -ge 26
}

function Versao-Do-Java($javaExe) {
    if (-not (Test-Path $javaExe)) { return 0 }
    $saida = cmd /c "`"$javaExe`" -version 2>&1"
    $linha = ($saida | Select-Object -First 1) -as [string]
    if ($linha -match 'version "(\d+)') { return [int]$Matches[1] }
    return 0
}

Write-Host 'Feira Dev - preparando este computador' -ForegroundColor Yellow
New-Item -ItemType Directory -Force $ferramentas | Out-Null

# ------------------------------------------------------------------ Git
Titulo 'Git'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host '  Git nao encontrado. Instale em https://git-scm.com e rode o preparar.cmd de novo.' -ForegroundColor Red
    exit 1
}
Ok (git --version)

# ------------------------------------------------------------------ Node
Titulo 'Node.js (precisa ser 22.22+ ou 24.15+)'
$nodeDir = $null
$doSistema = Get-Command node -ErrorAction SilentlyContinue
$versao = if ($doSistema) { Versao-Do-Node $doSistema.Source } else { $null }
if (Node-Serve $versao) {
    $nodeDir = Split-Path -Parent $doSistema.Source
    Ok "uso o Node que ja esta instalado ($versao)"
} else {
    $nodeDir = Join-Path $ferramentas 'node'
    $versaoBaixada = Versao-Do-Node (Join-Path $nodeDir 'node.exe')
    if (-not (Node-Serve $versaoBaixada)) {
        if ($versao) { Write-Host "  O Node instalado ($versao) e antigo para o Angular 22. Vou baixar um Node 24 so para a feira." }
        else { Write-Host '  Node nao encontrado. Vou baixar um Node 24 so para a feira.' }
        Write-Host '  Baixando (uns 30 MB)...'
        Baixar-E-Extrair $NODE_ZIP $nodeDir
        $versaoBaixada = Versao-Do-Node (Join-Path $nodeDir 'node.exe')
    }
    Ok "Node $versaoBaixada em $nodeDir (o seu outro Node continua igual)"
}

# ------------------------------------------------------------------ Java
Titulo 'Java (precisa ser 21 ou mais novo)'
$jdkDir = $null
$candidatos = @()
if ($env:JAVA_HOME) { $candidatos += $env:JAVA_HOME }
$javaDoPath = Get-Command java -ErrorAction SilentlyContinue
if ($javaDoPath) { $candidatos += (Split-Path -Parent (Split-Path -Parent $javaDoPath.Source)) }
foreach ($c in $candidatos) {
    # So vale um JDK de verdade (com javac), porque o projeto compila Java.
    if ((Versao-Do-Java (Join-Path $c 'bin\java.exe')) -ge 21 -and (Test-Path (Join-Path $c 'bin\javac.exe'))) { $jdkDir = $c; break }
}
if ($jdkDir) {
    Ok "uso o Java que ja esta instalado ($jdkDir)"
} else {
    $jdkDir = Join-Path $ferramentas 'jdk'
    if ((Versao-Do-Java (Join-Path $jdkDir 'bin\java.exe')) -lt 21) {
        Write-Host '  Nao achei um JDK 21. Vou baixar um Java 21 so para a feira.'
        Write-Host '  Baixando (uns 200 MB, pode levar alguns minutos)...'
        Baixar-E-Extrair $JDK_ZIP $jdkDir
    }
    Ok "Java 21 em $jdkDir (o seu outro Java continua igual)"
}

# ------------------------------------------------------------------ caminhos para o piloto.cmd
$caminhos = Join-Path $ferramentas 'caminhos.cmd'
@(
    '@rem Gerado pelo preparar.cmd da Feira Dev. O piloto.cmd le este arquivo.',
    "set `"JAVA_HOME=$jdkDir`"",
    "set `"PATH=$nodeDir;$jdkDir\bin;%PATH%`""
) | Set-Content -Path $caminhos -Encoding ASCII

$env:JAVA_HOME = $jdkDir
$env:PATH = "$nodeDir;$jdkDir\bin;$env:PATH"

# ------------------------------------------------------------------ o resto, em Node
Set-Location $raiz
& (Join-Path $nodeDir 'node.exe') (Join-Path $raiz 'scripts\preparar.mjs')
exit $LASTEXITCODE
