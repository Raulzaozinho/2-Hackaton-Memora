package br.com.memora.feira.plataforma;

/**
 * As cartas de evento: no meio de uma missão, a organização sorteia uma e o telão mostra a carta
 * com um relógio próprio. Quebram a rotina sem mexer no código de ninguém.
 */
public enum Carta {
    MUDO("🤐", "Copiloto mudo", "Por 2 minutos o copiloto só pode se comunicar por gestos.", 2),
    TROCA("🔄", "Troca relâmpago", "Copiloto e repórter trocam de cadeira e de papel por 3 minutos.", 3),
    BONUS("⚡", "Bônus relâmpago", "A primeira equipe que entregar um item novo do manual ganha +10 pontos.", 3),
    ECO("🦜", "Modo papagaio", "Por 2 minutos o piloto repete em voz alta cada instrução antes de digitar.", 2),
    SIM_OU_NAO("🎯", "Sim ou não", "Por 2 minutos o piloto só pode fazer perguntas, e o copiloto só responde sim ou não.", 2),
    PRESENTE("🎁", "Espiada de presente", "Cada equipe ganha uma espiada extra neste ciclo.", 1),
    TELEFONE("📞", "Telefone sem fio", "Por 2 minutos o copiloto cochicha a instrução para o repórter, e só o repórter fala com o piloto.", 2),
    NARRADOR("🎙️", "Narrador de futebol", "Por 2 minutos o repórter narra o que aparece na tela como um locutor de futebol. Gol é quando funciona!", 2),
    CAMERA_LENTA("🐢", "Câmera lenta", "Por 2 minutos o copiloto dita devagar, uma palavra de cada vez, e o piloto confirma cada uma.", 2),
    DETETIVE("🕵️", "Detetive", "Por 2 minutos o repórter pode visitar a barraca de outra equipe na feira e trazer uma ideia.", 2),
    VIZINHO("🤝", "Ajuda do vizinho", "Cada copiloto pode fazer UMA pergunta ao copiloto de outra equipe. Vale pedir dica!", 2),
    PLANTAO("📢", "Plantão de notícias", "Cada repórter tem 20 segundos para contar à sala o que a barraca dele já faz.", 2),
    SORTE("🍀", "Sorte de principiante", "A equipe com menos pontos no telão ganha uma espiada extra agora.", 1),
    VISUAL("🎨", "Visual relâmpago", "A primeira equipe que entregar uma mudança de visual (cor, borda ou letra) ganha +10 pontos.", 3),
    ELOGIO("💬", "Pausa para o elogio", "Todo mundo para por 1 minuto: cada pessoa faz um elogio sincero a alguém da própria equipe.", 1);

    public final String emoji;
    public final String titulo;
    public final String texto;
    public final int minutos;

    Carta(String emoji, String titulo, String texto, int minutos) {
        this.emoji = emoji;
        this.titulo = titulo;
        this.texto = texto;
        this.minutos = minutos;
    }
}
