package com.todo.server.dto;

import java.time.LocalDate;

import com.todo.server.model.ServerEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ServerDTO {
	private String id;
	private String title;
	private boolean done;
    private LocalDate deadline;
    private String importance; 
	
    public ServerDTO(final ServerEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.done = entity.isDone();
        this.deadline = entity.getDeadline();
        this.importance = entity.getImportance();
    }

    public static ServerEntity toEntity(final ServerDTO dto) {
        return ServerEntity.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .done(dto.isDone())
                .deadline(dto.getDeadline())
                .importance(dto.getImportance())
                .build();
    }
}
