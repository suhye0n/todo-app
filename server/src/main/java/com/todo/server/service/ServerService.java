package com.todo.server.service;

import java.util.List;
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
	
	public List<ServerEntity> create(final ServerEntity entity) {
		validate(entity);
		repository.save(entity);
		return repository.findByUserId(entity.getUserId());
	}
	
	public List<ServerEntity> retrieve(final String userId) {
		return repository.findByUserId(userId);
	}
	
	public List<ServerEntity> update(final ServerEntity entity) {
		validate(entity);
		if (repository.existsById(entity.getId())) {
			repository.save(entity);
		}
		else
			throw new RuntimeException("Unknown id");
		
		return repository.findByUserId(entity.getUserId());
	}
	
	public List<ServerEntity> delete(final ServerEntity entity) {
		if(repository.existsById(entity.getId()))
			repository.deleteById(entity.getId());
		else
			throw new RuntimeException("id does not exist");
		
		return repository.findByUserId(entity.getUserId());
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
