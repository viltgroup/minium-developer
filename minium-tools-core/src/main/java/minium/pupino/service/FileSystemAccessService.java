package minium.pupino.service;

import java.io.File;
import java.io.IOException;

import org.springframework.stereotype.Service;

@Service
public class FileSystemAccessService {

	private File baseDir = new File("src/test/resources");

	public int create(String path) {
		File file;
		int r = 0; 
		try {
			file = getFile(path);
			if (file.exists()) {
				r = 1;
			} else {
				file.createNewFile();
			}
		} catch (IOException e) {
			r = 1;
			e.printStackTrace();
		}
		return r;
	}

	protected File getFile(String path) throws IOException {
		return new File(baseDir, path.replaceAll("%20", " "));
	}

}
