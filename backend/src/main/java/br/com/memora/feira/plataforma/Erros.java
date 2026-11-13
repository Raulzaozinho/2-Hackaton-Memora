package br.com.memora.feira.plataforma;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Transforma erros em respostas que o front consegue mostrar: {"mensagem": "..."}. */
@RestControllerAdvice
public class Erros {

    /** Uma regra da feira foi quebrada. A mensagem aparece para a pessoa na tela. */
    public static class RegraException extends RuntimeException {
        public RegraException(String mensagem) {
            super(mensagem);
        }
    }

    public static class PinInvalidoException extends RuntimeException { }

    public static class InicializandoException extends RuntimeException { }

    @ExceptionHandler(InicializandoException.class)
    public ResponseEntity<Map<String, String>> inicializando(InicializandoException e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("mensagem", "A feira está iniciando. Tente novamente em instantes."));
    }

    @ExceptionHandler(RegraException.class)
    public ResponseEntity<Map<String, String>> regra(RegraException e) {
        return ResponseEntity.badRequest().body(Map.of("mensagem", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> validacao(MethodArgumentNotValidException e) {
        String mensagem = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(erro -> erro.getField() + ": " + erro.getDefaultMessage())
                .orElse("Dados inválidos");
        return ResponseEntity.badRequest().body(Map.of("mensagem", mensagem));
    }

    @ExceptionHandler(PinInvalidoException.class)
    public ResponseEntity<Map<String, String>> pin(PinInvalidoException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensagem", "PIN da organização incorreto"));
    }
}
