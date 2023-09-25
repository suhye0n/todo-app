package com.todo.server.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.todo.server.model.ServerEntity;

@Repository
public interface ServerRepository extends JpaRepository<ServerEntity, String> {

}
