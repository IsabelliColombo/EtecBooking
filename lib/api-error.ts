import { MongoError } from "mongodb";

/** Padroniza falhas de API sem enviar detalhes internos do banco ao navegador. */
export function withApiErrors<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("Falha ao processar uma API:", error);
      const unavailable =
        error instanceof MongoError ||
        (error instanceof Error &&
          error.message.startsWith("Missing environment variable:"));

      return Response.json(
        {
          error: unavailable
            ? "Banco de dados indisponível. Tente novamente em alguns instantes."
            : "Não foi possível concluir a solicitação. Tente novamente.",
        },
        { status: unavailable ? 503 : 500 },
      );
    }
  };
}
