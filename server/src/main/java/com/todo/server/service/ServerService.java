package com.todo.server.service;

import java.util.List;
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
	
	public List<ServerEntity>retrieve(final String userId) {
		return repository.findByUserId(userId);
	}
	
	public Optional<ServerEntity>update(final ServerEntity entity) {
		validate(entity);
		if (repository.existsById(entity.getId())) {
			repository.save(entity);
		}
		else
			throw new RuntimeException("Unknown id");
		
		return repository.findById(entity.getId());
	}
	
	public Optional<ServerEntity>updateTodo(final ServerEntity entity) {
		validate(entity);
		
		final Optional<ServerEntity> original = repository.findById(entity.getId());
		
		original.ifPresent(todo -> {
			todo.setTitle(entity.getTitle());
			todo.setDone(entity.isDone());
			repository.save(todo);
		});
		
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
