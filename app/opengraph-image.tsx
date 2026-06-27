import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Banner social 1200×630 gerado on-demand (degradê da marca + foto real do açaí).
// Convenção do Next: alimenta automaticamente og:image e twitter:image.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Recanto do Açaí · Estação de açaí e sorvete gourmet para eventos no Rio de Janeiro";

export default async function OpengraphImage() {
  const photo = await readFile(
    join(process.cwd(), "public/images/produtos/acai-cremoso-colher.jpg"),
  );
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* Lado do texto — degradê roxo da marca */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "62%",
            height: "100%",
            padding: "60px 58px",
            background:
              "linear-gradient(135deg, #2a1140 0%, #5a18a0 55%, #7c1fd6 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: "rgba(212,160,23,0.16)",
              color: "#f0c64a",
              border: "1px solid rgba(212,160,23,0.5)",
              borderRadius: 999,
              padding: "8px 18px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            ESTAÇÕES GOURMET · RIO DE JANEIRO
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 62,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              marginTop: 28,
            }}
          >
            Estação de Açaí & Sorvete para Eventos
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#e9d9ff",
              marginTop: 22,
              lineHeight: 1.35,
            }}
          >
            Servida na hora pela nossa equipe — a gente cuida de tudo.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 42,
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            <span style={{ color: "#d4a017" }}>Recanto do Açaí</span>
            <span
              style={{
                color: "#c9b3e6",
                fontWeight: 500,
                marginLeft: 16,
                fontSize: 24,
              }}
            >
              · Reserva 100% online
            </span>
          </div>
        </div>
        {/* Lado da foto */}
        <div style={{ display: "flex", width: "38%", height: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            width={456}
            height={630}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt=""
          />
        </div>
      </div>
    ),
    size,
  );
}
