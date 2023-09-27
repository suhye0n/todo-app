package com.todo.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todo.server.dto.ResponseDTO;
import com.todo.server.dto.ServerDTO;
import com.todo.server.model.ServerEntity;
import com.todo.server.service.ServerService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("todo")
public class ServerController {
	
	@Autowired
	private ServerService service;
	
	@PostMapping
	public ResponseEntity<?> createTodo(@RequestBody ServerDTO dto) {
		try {
			log.info("Log: create Todo entrance");
			
			ServerEntity entity = ServerDTO.toEntity(dto);
			log.info("Log:dto => entity ok!");
			
			entity.setUserId("temporary-user");
			
			List<ServerEntity> entities = service.create(entity);
			log.info("Log: service.create ok!");
			
			List<ServerDTO> dtos = entities.stream().map(ServerDTO::new).collect(Collectors.toList());
			log.info("Log: entities => dtos ok!");
			
			ResponseDTO<ServerDTO> response = ResponseDTO.<ServerDTO>builder().data(dtos).build();
			log.info("Log: responsedto ok!");
			
			return ResponseEntity.ok().body(response);
		} catch (Exception e) {
			String error = e.getMessage();
			ResponseDTO<ServerDTO> response = ResponseDTO.<ServerDTO>builder().error(error).build();
			return ResponseEntity.badRequest().body(response);
		}
	}
		
	@GetMapping
	public ResponseEntity<?> retrieveTodoList() {
		String temporaryUserId = "temporary-user";
		List<ServerEntity> entities = service.retrieve(temporaryUserId);
		List<ServerDTO> dtos = entities.stream().map(ServerDTO::new).collect(Collectors.toList());
		
		ResponseDTO<ServerDTO> response = ResponseDTO.<ServerDTO>builder().data(dtos).build();
		
		return ResponseEntity.ok().body(response);
	}
	
	@GetMapping("/update")
	public ResponseEntity<?>update(@RequestBody ServerDTO dto) {
		try {
			ServerEntity entity = ServerDTO.toEntity(dto);
			
			entity.setUserId("temporary-user");
			
			List<ServerEntity> entities = service.update(entity);
			
			List<ServerDTO> dtos = entities.stream().map(ServerDTO::new).collect(Collectors.toList());
			
			ResponseDTO<ServerDTO> response = ResponseDTO.<ServerDTO>builder().data(dtos).build();
			
			return ResponseEntity.ok().body(response);
		} catch (Exception e) {
			String error = e.getMessage();
			ResponseDTO<ServerDTO> response = ResponseDTO.<ServerDTO>builder().error(error).build();
			
			return ResponseEntity.badRequest().body(response);
		}
	}
	
	@PutMapping
	public ResponseEntity<?> updateTodo(@RequestBody ServerDTO dto) {
		try {
			ServerEntity entity = ServerDTO.toEntity(dto);
			
			entity.setUserId("temporary-user");
			
			List<ServerEntity> entities = service.update(entity);
			
			List<ServerDTO> dtos = entities.stream().map(ServerDTO::new).collect(Collectors.toList());
			
			ResponseDTO<ServerDTO> response = ResponseDTO.<ServerDTO>builder().data(dtos).build();
			
			return ResponseEntity.ok().body(response);
		} catch (Exception e) {
			String error = e.getMessage();
			ResponseDTO<ServerDTO> response = ResponseDTO.<ServerDTO>builder().error(error).build();
			return ResponseEntity.badRequest().body(response);
		}
	}
	
	@DeleteMapping
    public ResponseEntity<?> deleteTodo(@RequestBody ServerDTO dto){
        try {
        	ServerEntity entity = ServerDTO.toEntity(dto);
			
			entity.setUserId("temporary-user");

            List<ServerEntity> entities = service.delete(entity);

            List<ServerDTO> dtos = entities.stream().map(ServerDTO::new).collect(Collectors.toList());

            ResponseDTO<ServerDTO> response = ResponseDTO.<ServerDTO>builder().data(dtos).build();

            return ResponseEntity.ok().body(response);
        }catch(Exception e){
            String error = e.getMessage();
            ResponseDTO<ServerDTO> response = ResponseDTO.<ServerDTO>builder().error(error).build();
            return ResponseEntity.badRequest().body(response);
        }

    }
}
