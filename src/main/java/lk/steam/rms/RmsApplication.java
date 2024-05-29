package lk.steam.rms;

import lk.steam.rms.dao.EmployeeDAO;
import lk.steam.rms.dao.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@SpringBootApplication
@RestController
public class RmsApplication {

    @Autowired
    private UserDAO userDAO;


	public static void main(String[] args) {
		SpringApplication.run(RmsApplication.class, args);
		System.out.println("RMS System is now running!");
	}

	@RequestMapping(value = "/New-Registration")
	public ModelAndView imsInquiries(){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		ModelAndView newRegistrationView = new ModelAndView();
		newRegistrationView.setViewName("newregistration.html");
		newRegistrationView.addObject("username",auth.getName());
		newRegistrationView.addObject("title","New Registration | STEAM RMS");
		newRegistrationView.addObject("activeNavItem","newRegistration");
		String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
		String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
		newRegistrationView.addObject("loggedInEmployeeName",loggedInEmployeeName);
		newRegistrationView.addObject("loggedInDesignationName",loggedInDesignationName);

		return newRegistrationView;
	}

}
