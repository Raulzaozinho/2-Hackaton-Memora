package br.com.memora.feira;

import java.io.File;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/** O ponto de partida do back-end. Para rodar: ./mvnw spring-boot:run */
@SpringBootApplication
@EnableJpaRepositories(considerNestedRepositories = true)
public class FeiraApplication {

    public static void main(String[] args) {
        evitarSocketsUnixNoWindows();
        SpringApplication.run(FeiraApplication.class, args);
    }

    /**
     * Em algumas máquinas Windows o Java não consegue usar "sockets de domínio Unix" e o servidor
     * não sobe, com o erro "Unable to establish loopback connection". Apontar esses sockets para
     * uma pasta que não existe faz o Java usar o caminho tradicional (TCP), que funciona em qualquer máquina.
     */
    private static void evitarSocketsUnixNoWindows() {
        boolean windows = System.getProperty("os.name", "").toLowerCase().contains("win");
        if (windows && System.getProperty("jdk.net.unixdomain.tmpdir") == null) {
            String pastaQueNaoExiste = System.getProperty("java.io.tmpdir") + File.separator + "feira-sem-sockets-unix";
            System.setProperty("jdk.net.unixdomain.tmpdir", pastaQueNaoExiste);
        }
    }
}
