package br.com.memora.feira.plataforma;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

/** Uma pessoa da feira. Nasce do crachá em src/main/resources/crachas. */
@Entity
public class Participante {

    /** O nome do arquivo do crachá, sem o .json. */
    @Id
    private String slug;
    private String nome;
    private String emoji;
    private String frase;
    /** "equipe-1", "equipe-2", "equipe-3" ou vazio enquanto as equipes não foram definidas. */
    private String equipe;
    /** Posição dentro da equipe; define o rodízio de papéis. */
    private Integer ordem;

    protected Participante() { }

    public Participante(String slug) { this.slug = slug; }

    public String getSlug() { return slug; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    public String getFrase() { return frase; }
    public void setFrase(String frase) { this.frase = frase; }
    public String getEquipe() { return equipe; }
    public void setEquipe(String equipe) { this.equipe = equipe; }
    public Integer getOrdem() { return ordem; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }
}
