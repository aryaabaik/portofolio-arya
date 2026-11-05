package com.portofolio.portofolio_arya.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentCaptor.forClass;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import org.springframework.web.multipart.MultipartFile;

import com.portofolio.portofolio_arya.Model.Project;
import com.portofolio.portofolio_arya.Repository.ProjectRepository;
import com.portofolio.portofolio_arya.Util.FileUploadUtil;

class ProjectControllerTests {

    @Test
    void appendsNewPhotoAfterExistingPhotos() throws Exception {
        ProjectRepository repository = mock(ProjectRepository.class);
        Project existing = new Project();
        existing.setId(6L);
        existing.setFoto("first.jpg");
        existing.setFoto2("second.jpg");
        when(repository.findById(6L)).thenReturn(Optional.of(existing));

        Project submitted = new Project();
        submitted.setId(6L);
        submitted.setFoto("first.jpg");
        submitted.setFoto2("second.jpg");
        MockMultipartFile upload = new MockMultipartFile(
                "imageFiles", "third.jpg", "image/jpeg", new byte[] { 1 });
        ProjectController controller = new ProjectController(repository);

        try (MockedStatic<FileUploadUtil> fileUpload = mockStatic(FileUploadUtil.class)) {
            fileUpload.when(() -> FileUploadUtil.saveFile(upload)).thenReturn("third.jpg");

            assertEquals("redirect:/project", controller.updateproject(submitted, null, List.of(upload)));
        }

        assertEquals("first.jpg", submitted.getFoto());
        assertEquals("second.jpg", submitted.getFoto2());
        assertEquals("third.jpg", submitted.getFoto3());
        assertNull(submitted.getFoto4());
        assertNull(submitted.getFoto5());
        verify(repository).save(submitted);
    }

    @Test
    void appendsFourPhotosWhenOnePhotoAlreadyExists() throws Exception {
        ProjectRepository repository = mock(ProjectRepository.class);
        Project existing = new Project();
        existing.setId(6L);
        existing.setFoto("first.jpg");
        when(repository.findById(6L)).thenReturn(Optional.of(existing));

        Project submitted = new Project();
        submitted.setId(6L);
        List<MultipartFile> uploads = List.of(
                new MockMultipartFile("imageFiles", "second.jpg", "image/jpeg", new byte[] { 2 }),
                new MockMultipartFile("imageFiles", "third.jpg", "image/jpeg", new byte[] { 3 }),
                new MockMultipartFile("imageFiles", "fourth.jpg", "image/jpeg", new byte[] { 4 }),
                new MockMultipartFile("imageFiles", "fifth.jpg", "image/jpeg", new byte[] { 5 }));
        ProjectController controller = new ProjectController(repository);

        try (MockedStatic<FileUploadUtil> fileUpload = mockStatic(FileUploadUtil.class)) {
            for (int i = 0; i < uploads.size(); i++) {
                int index = i;
                fileUpload.when(() -> FileUploadUtil.saveFile(uploads.get(index)))
                        .thenReturn(uploads.get(index).getOriginalFilename());
            }

            controller.updateproject(submitted, null, uploads);
        }

        assertEquals("first.jpg", submitted.getFoto());
        assertEquals("second.jpg", submitted.getFoto2());
        assertEquals("third.jpg", submitted.getFoto3());
        assertEquals("fourth.jpg", submitted.getFoto4());
        assertEquals("fifth.jpg", submitted.getFoto5());
        verify(repository).save(submitted);
    }

    @Test
    void removesOneExistingPhotoAndAppendsItsReplacement() throws Exception {
        ProjectRepository repository = mock(ProjectRepository.class);
        Project existing = new Project();
        existing.setId(6L);
        existing.setFoto("first.jpg");
        existing.setFoto2("second.jpg");
        existing.setFoto3("third.jpg");
        when(repository.findById(6L)).thenReturn(Optional.of(existing));

        Project submitted = new Project();
        submitted.setId(6L);
        MockMultipartFile replacement = new MockMultipartFile(
                "imageFiles", "replacement.jpg", "image/jpeg", new byte[] { 6 });
        ProjectController controller = new ProjectController(repository);

        try (MockedStatic<FileUploadUtil> fileUpload = mockStatic(FileUploadUtil.class)) {
            fileUpload.when(() -> FileUploadUtil.saveFile(replacement)).thenReturn("replacement.jpg");

            controller.updateproject(submitted, List.of(1), List.of(replacement));
        }

        assertEquals("first.jpg", submitted.getFoto());
        assertEquals("third.jpg", submitted.getFoto2());
        assertEquals("replacement.jpg", submitted.getFoto3());
        assertNull(submitted.getFoto4());
        assertNull(submitted.getFoto5());
        verify(repository).save(submitted);
    }

    @Test
    void appendsMultipartUploadAfterFourExistingPhotos() throws Exception {
        ProjectRepository repository = mock(ProjectRepository.class);
        Project existing = new Project();
        existing.setId(6L);
        existing.setFoto("first.jpg");
        existing.setFoto2("second.jpg");
        existing.setFoto3("third.jpg");
        existing.setFoto4("fourth.jpg");
        when(repository.findById(6L)).thenReturn(Optional.of(existing));

        MockMultipartFile upload = new MockMultipartFile(
                "imageFiles", "fifth.jpg", "image/jpeg", new byte[] { 5 });
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new ProjectController(repository)).build();

        try (MockedStatic<FileUploadUtil> fileUpload = mockStatic(FileUploadUtil.class)) {
            fileUpload.when(() -> FileUploadUtil.saveFile(upload)).thenReturn("fifth.jpg");

            MvcResult result = mvc.perform(multipart("/project/edit")
                    .file(upload)
                    .param("id", "6")
                    .param("name", "SaveTrack")
                    .param("foto", "first.jpg")
                    .param("foto2", "second.jpg")
                    .param("foto3", "third.jpg")
                    .param("foto4", "fourth.jpg"))
                    .andReturn();

            assertEquals("redirect:/project", result.getModelAndView().getViewName());
        }

        var savedProject = forClass(Project.class);
        verify(repository).save(savedProject.capture());
        assertEquals("first.jpg", savedProject.getValue().getFoto());
        assertEquals("second.jpg", savedProject.getValue().getFoto2());
        assertEquals("third.jpg", savedProject.getValue().getFoto3());
        assertEquals("fourth.jpg", savedProject.getValue().getFoto4());
        assertEquals("fifth.jpg", savedProject.getValue().getFoto5());
    }
}