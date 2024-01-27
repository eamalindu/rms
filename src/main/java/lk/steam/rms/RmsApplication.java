package lk.steam.rms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@SpringBootApplication
@RestController
public class RmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(RmsApplication.class, args);
		System.out.println("RMS System is now running!");
	}

	@RequestMapping(value = "/New-Registration")
	public ModelAndView imsInquiries(){
		ModelAndView imsInquiriesView = new ModelAndView();
		imsInquiriesView.setViewName("newregistration.html");
		return imsInquiriesView;
	}

}
