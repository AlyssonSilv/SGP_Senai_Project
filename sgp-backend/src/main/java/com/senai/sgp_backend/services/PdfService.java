package com.senai.sgp_backend.services;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.senai.sgp_backend.models.Solicitacao;
import com.senai.sgp_backend.repositories.SolicitacaoRepository;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.File;
import java.io.OutputStream;
import java.net.URL;
import java.util.List;

@Service
public class PdfService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final TemplateEngine templateEngine;

    public PdfService(SolicitacaoRepository solicitacaoRepository, TemplateEngine templateEngine) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.templateEngine = templateEngine;
    }

    public void exportarAgendaConfirmada(OutputStream outputStream) {
        try {
            // 1. Busca os dados
            List<Solicitacao> confirmadas = solicitacaoRepository.findByStatus("CONFIRMADO");

            System.out.println("========================================");
            System.out.println("GERANDO PDF - Iniciando processo...");
            System.out.println("Solicitações encontradas no BD: " + confirmadas.size());

            // 2. Prepara os dados para o HTML
            Context context = new Context();
            context.setVariable("solicitacoes", confirmadas);

            // 3. O Thymeleaf processa o arquivo "agenda.html" e preenche os dados
            String htmlProcessado = templateEngine.process("agenda", context);
            System.out.println("Thymeleaf processou o template 'agenda.html' com sucesso.");

            // 4. Lógica blindada para encontrar as imagens na pasta static
            String baseUri = "";
            try {
                URL res = getClass().getResource("/static/");
                if (res != null) {
                    baseUri = res.toURI().toString();
                } else {
                    // Plano B: Caminho absoluto físico da máquina (perfeito para local/IDE)
                    File staticDir = new File("src/main/resources/static/");
                    if (staticDir.exists()) {
                        baseUri = staticDir.toURI().toString();
                    }
                }
                System.out.println("Caminho base das imagens (baseUri): " + baseUri);
            } catch (Exception e) {
                System.err.println("Aviso: Falha ao resolver o baseUri. As imagens podem não carregar.");
            }

            // 5. Converte o HTML pronto para PDF
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlProcessado, baseUri);
            builder.toStream(outputStream);
            builder.run();

            System.out.println("PDF gerado com sucesso e enviado ao stream!");
            System.out.println("========================================");

        } catch (Exception e) {
            System.err.println("========================================");
            System.err.println("ERRO CRÍTICO NA GERAÇÃO DO PDF:");
            System.err.println("Mensagem: " + e.getMessage());
            e.printStackTrace();
            System.err.println("========================================");

            throw new RuntimeException("Erro ao converter HTML para PDF: " + e.getMessage(), e);
        }
    }
}