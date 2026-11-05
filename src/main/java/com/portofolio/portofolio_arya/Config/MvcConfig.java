package com.portofolio.portofolio_arya.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get("src/main/resources/static/images");
        String uploadUri = uploadDir.toFile().toURI().toString();

        registry.addResourceHandler("/images/**")
                .addResourceLocations(uploadUri, "classpath:/static/images/");
    }
}
