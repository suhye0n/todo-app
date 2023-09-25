package com.todo.server.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.todo.server.model.ServerEntity;

@Repository
public interface ServerRepository extends JpaRepository<ServerEntity, String> {

	@Query("select t from ServerEntity t where t.userId = ?1")
	List<ServerEntity> findByUserId(String userId);
}
