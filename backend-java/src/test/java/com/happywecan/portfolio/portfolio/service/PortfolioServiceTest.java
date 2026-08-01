package com.happywecan.portfolio.portfolio.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.happywecan.portfolio.portfolio.domain.PortfolioDocument;
import com.happywecan.portfolio.portfolio.domain.PortfolioLink;
import com.happywecan.portfolio.portfolio.repository.PortfolioRepository;
import com.happywecan.portfolio.portfolio.web.PortfolioResponse;
import com.happywecan.portfolio.shared.error.InvalidPortfolioIdException;
import com.happywecan.portfolio.shared.error.PortfolioNotFoundException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PortfolioServiceTest {

    private static final String VALID_ID = "507f1f77bcf86cd799439011";

    @Mock
    private PortfolioRepository repository;

    @Test
    void returnsPortfolioItemsInRepositoryOrder() {
        PortfolioDocument document = sampleDocument();
        when(repository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(document));
        PortfolioService service = new PortfolioService(repository);

        List<PortfolioResponse> result = service.findAll();

        assertThat(result).containsExactly(PortfolioResponse.from(document));
    }

    @Test
    void rejectsInvalidMongoObjectIdBeforeCallingRepository() {
        PortfolioService service = new PortfolioService(repository);

        assertThatThrownBy(() -> service.findById("not-an-object-id"))
                .isInstanceOf(InvalidPortfolioIdException.class);
        verify(repository, never()).findById("not-an-object-id");
    }

    @Test
    void returnsPortfolioWhenIdExists() {
        PortfolioDocument document = sampleDocument();
        when(repository.findById(VALID_ID)).thenReturn(Optional.of(document));
        PortfolioService service = new PortfolioService(repository);

        PortfolioResponse result = service.findById(VALID_ID);

        assertThat(result).isEqualTo(PortfolioResponse.from(document));
    }

    @Test
    void reportsNotFoundWhenValidIdDoesNotExist() {
        when(repository.findById(VALID_ID)).thenReturn(Optional.empty());
        PortfolioService service = new PortfolioService(repository);

        assertThatThrownBy(() -> service.findById(VALID_ID))
                .isInstanceOf(PortfolioNotFoundException.class);
    }

    private PortfolioDocument sampleDocument() {
        return new PortfolioDocument(
                VALID_ID,
                "Java migration",
                "Moving the portfolio API to Spring Boot",
                "# Details",
                "/static/uploads/java.png",
                "https://github.com/example/project",
                "https://example.com",
                List.of(new PortfolioLink("Live site", "https://example.com")),
                List.of("Java", "Spring Boot"),
                LocalDateTime.of(2026, 7, 25, 10, 0),
                null);
    }
}
