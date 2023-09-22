package com.example.demo;

import jakarta.annotation.Nonnull;
import lombok.Builder;
import lombok.RequiredArgsConstructor;

@Builder
@RequiredArgsConstructor
public class DemoModel {
	
	@Nonnull
	private String id;

}
