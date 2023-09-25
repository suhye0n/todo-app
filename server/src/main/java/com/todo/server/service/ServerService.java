package com.todo.server.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo.server.model.ServerEntity;
import com.todo.server.persistence.ServerRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ServerService {
	
	@Autowired
	private ServerRepository repository;
	
	public Optional<ServerEntity> create(final ServerEntity entity) {
		validate(entity);
		repository.save(entity);
		return repository.findById(entity.getId());
	}
	
	public void validate(final ServerEntity entity) {
		if(entity == null) {
			log.warn("Entity cannot be null.");
			throw new RuntimeException("Entity cannot be null.");
		}
		if(entity.getUserId() == null) {
			log.warn("Unknown user.");
			throw new RuntimeException("Unknown user.");
		}
	}

}
