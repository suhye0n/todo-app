package com.todo.server.dto;

import java.util.List;

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
	
	public ServerDTO(final ServerEntity entity) {
		this.id = entity.getId();
		this.title = entity.getTitle();
		this.done = entity.isDone();
	}
	
	public static ServerEntity toEntity(final ServerDTO dto) {
		return ServerEntity.builder()
				.id(dto.getId())
				.title(dto.getTitle())
				.done(dto.isDone()).build();
	}
}
