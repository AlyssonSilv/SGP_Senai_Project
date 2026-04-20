package com.senai.sgp_backend.services;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.senai.sgp_backend.models.Solicitacao;
import com.senai.sgp_backend.repositories.SolicitacaoRepository;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.OutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfService {

    private final SolicitacaoRepository solicitacaoRepository;

    public PdfService(SolicitacaoRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public void exportarAgendaConfirmada(OutputStream outputStream) {
        try {
            List<Solicitacao> confirmadas = solicitacaoRepository.findByStatus("CONFIRMADO");

            // Documento A4 Paisagem para caberem todas as 8 colunas
            Document document = new Document(PageSize.A4.rotate(), 20, 20, 30, 30);
            PdfWriter.getInstance(document, outputStream);
            document.open();

            // CABEÇALHO DO FORMULÁRIO OFICIAL (Tabela invisível)
            PdfPTable cabecalho = new PdfPTable(3);
            cabecalho.setWidthPercentage(100);
            cabecalho.setWidths(new float[]{2f, 6f, 2f});
            cabecalho.setSpacingAfter(15f);

            // Logótipo
            PdfPCell celulaLogo = new PdfPCell();
            celulaLogo.setBorder(Rectangle.NO_BORDER);
            celulaLogo.setHorizontalAlignment(Element.ALIGN_CENTER);
            try {
                Image logo = Image.getInstance(getClass().getResource("/logo-senai.png"));
                logo.scaleToFit(90, 45);
                celulaLogo.addElement(logo);
            } catch (Exception e) {
                Paragraph pLogo = new Paragraph("SENAI", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
                pLogo.setAlignment(Element.ALIGN_CENTER);
                celulaLogo.addElement(pLogo);
            }
            cabecalho.addCell(celulaLogo);

            // Títulos
            PdfPCell celulaTitulo = new PdfPCell();
            celulaTitulo.setBorder(Rectangle.NO_BORDER);
            Paragraph p1 = new Paragraph("SERVIÇO NACIONAL DE APRENDIZAGEM INDUSTRIAL", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12));
            p1.setAlignment(Element.ALIGN_CENTER);
            Paragraph p2 = new Paragraph("AGENDA DE TREINAMENTOS - CTA", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14));
            p2.setAlignment(Element.ALIGN_CENTER);
            celulaTitulo.addElement(p1);
            celulaTitulo.addElement(p2);
            cabecalho.addCell(celulaTitulo);

            // Data (Ref: Dia Seguinte)
            PdfPCell celulaData = new PdfPCell();
            celulaData.setBorder(Rectangle.NO_BORDER);
            String dataAmanha = LocalDate.now().plusDays(1).format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            Paragraph pRef = new Paragraph("Referência:\n" + dataAmanha, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11));
            pRef.setAlignment(Element.ALIGN_RIGHT);
            celulaData.addElement(pRef);
            cabecalho.addCell(celulaData);

            document.add(cabecalho);

            // ==========================================
            // TABELA DE DADOS OFICIAL COM AS 8 COLUNAS
            // ==========================================
            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100f);
            // Definição exata das larguras (para que o Treinamento e Empresa tenham mais espaço)
            table.setWidths(new float[]{1.3f, 1.3f, 2.0f, 2.5f, 2.5f, 2.0f, 1.0f, 0.8f});
            table.setHeaderRows(1);

            String[] titulos = {"DATA", "HORA", "PROTOCOLO", "EMPRESA", "TREINAMENTO", "INSTRUTOR", "SALA", "QTD"};
            Font fontCabecalho = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
            Color corFundo = new Color(0, 84, 156);

            for (String titulo : titulos) {
                PdfPCell cell = new PdfPCell(new Phrase(titulo, fontCabecalho));
                cell.setBackgroundColor(corFundo);
                cell.setPadding(6f);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                table.addCell(cell);
            }

            Font fontLinha = FontFactory.getFont(FontFactory.HELVETICA, 8, Color.BLACK);
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            for (Solicitacao sol : confirmadas) {
                table.addCell(criarCelula(sol.getDataSugerida() != null ? sol.getDataSugerida().format(dtf) : "-", fontLinha, Element.ALIGN_CENTER));
                table.addCell(criarCelula(sol.getHorario(), fontLinha, Element.ALIGN_CENTER));
                table.addCell(criarCelula(sol.getProtocolo(), fontLinha, Element.ALIGN_CENTER));
                table.addCell(criarCelula(sol.getEmpresa() != null ? sol.getEmpresa().getRazaoSocial() : "-", fontLinha, Element.ALIGN_LEFT));
                table.addCell(criarCelula(sol.getTreinamento(), fontLinha, Element.ALIGN_LEFT));
                table.addCell(criarCelula(sol.getInstrutor(), fontLinha, Element.ALIGN_LEFT));
                table.addCell(criarCelula(sol.getSala(), fontLinha, Element.ALIGN_CENTER));
                table.addCell(criarCelula(sol.getQuantidadeParticipantes() != null ? String.valueOf(sol.getQuantidadeParticipantes()) : "0", fontLinha, Element.ALIGN_CENTER));
            }

            document.add(table);
            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private PdfPCell criarCelula(String texto, Font fonte, int alinhamento) {
        PdfPCell cell = new PdfPCell(new Phrase(texto != null ? texto : "-", fonte));
        cell.setPadding(5f);
        cell.setHorizontalAlignment(alinhamento);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }
}