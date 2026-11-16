package br.com.memora.feira.plataforma;

import java.sql.Connection;
import java.util.List;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Ao criar a tabela "evento", o Hibernate grava no banco a lista de etapas e cartas que existiam
 * naquele dia (no Postgres, uma regra CHECK; no H2, uma coluna do tipo ENUM) e nunca mais a
 * atualiza. Quando o formato do dia muda, o banco passa a recusar as etapas novas e o "Próxima
 * etapa" falha. As listas certas já estão no Java (Etapa e Carta), então essas regras do banco são
 * removidas sempre que a feira sobe.
 */
@Component
public class RegrasAntigasDoBanco {

    private static final Logger LOG = LoggerFactory.getLogger(RegrasAntigasDoBanco.class);

    private final JdbcTemplate jdbc;
    private final DataSource dataSource;

    public RegrasAntigasDoBanco(JdbcTemplate jdbc, DataSource dataSource) {
        this.jdbc = jdbc;
        this.dataSource = dataSource;
    }

    public void remover() {
        List<String> regras;
        boolean h2;
        try (Connection conexao = dataSource.getConnection()) {
            String banco = conexao.getMetaData().getDatabaseProductName().toLowerCase();
            h2 = banco.contains("h2");
            if (banco.contains("postgres")) {
                regras = jdbc.queryForList(
                        "select conname from pg_constraint where conrelid = to_regclass('evento') and contype = 'c'",
                        String.class);
            } else if (banco.contains("h2")) {
                regras = jdbc.queryForList(
                        "select constraint_name from information_schema.table_constraints "
                                + "where table_name = 'EVENTO' and constraint_type = 'CHECK'",
                        String.class);
            } else {
                return;
            }
        } catch (Exception e) {
            LOG.warn("Não deu para conferir as regras antigas da tabela evento: {}", e.getMessage());
            return;
        }
        for (String regra : regras) {
            jdbc.execute("alter table evento drop constraint \"" + regra.replace("\"", "") + "\"");
            LOG.info("Regra antiga removida da tabela evento: {}", regra);
        }
        if (h2) {
            // No H2 a lista fica no próprio tipo da coluna: vira texto comum.
            jdbc.execute("alter table evento alter column etapa set data type varchar(40)");
            jdbc.execute("alter table evento alter column carta set data type varchar(40)");
        }
    }
}
