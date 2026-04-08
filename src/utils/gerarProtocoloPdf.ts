import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Exame } from "@/types/exames/ExamesDTO";

(pdfMake as any).vfs = pdfFonts.vfs;

export function gerarProtocoloPdf(exame: Exame) {
  const servicos = exame.servicos.map((s) => s.servico.nome).join(", ");

  // 📅 Data/hora da impressão
  const dataImpressao = new Date().toLocaleString("pt-BR");

  const documentDefinition: any = {
    content: [
      // 🏥 CLÍNICA
      {
        text: "EXAM MANAGEMENT",
        style: "clinic",
        alignment: "center",
      },

      {
        text: "PROTOCOLO DE EXAME",
        style: "header",
        alignment: "center",
        margin: [0, 5, 0, 20],
      },

      // 📅 DATA
      {
        text: `Data de impressão: ${dataImpressao}`,
        alignment: "right",
        fontSize: 9,
        margin: [0, 0, 0, 10],
      },

      {
        text: `Protocolo: ${exame.numero}`,
        margin: [0, 0, 0, 10],
      },

      {
        table: {
          widths: ["*", "*"],
          body: [
            ["Paciente", exame.paciente.nome],
            ["CPF", exame.paciente.cpf],
            ["Telefone", exame.paciente.telefone],
            ["Tipo", exame.tipo],
          ],
        },
      },

      {
        text: "Serviços:",
        margin: [0, 10, 0, 0],
      },
      {
        text: servicos,
        bold: true,
      },

      {
        text: "\n__________________________________",
        margin: [0, 30, 0, 5],
        alignment: "center",
      },
      {
        text: "Assinatura",
        alignment: "center",
      },
    ],

    styles: {
      header: {
        fontSize: 16,
        bold: true,
      },
      clinic: {
        fontSize: 14,
        bold: true,
        color: "#2c3e50",
      },
    },
  };

  pdfMake.createPdf(documentDefinition).open();
}
