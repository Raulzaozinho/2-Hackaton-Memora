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
    PRESENTE("🎁", "Espiada de presente", "Cada equipe ganha uma espiada extra neste ciclo.", 1);

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
