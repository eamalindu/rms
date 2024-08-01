package lk.steam.rms.controller;

import lk.steam.rms.dao.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.Base64;

@RestController
@RequestMapping("/Report")
public class ReportController {
    @Autowired
    private UserDAO userDAO;

    @GetMapping()
    public ModelAndView batchUI() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView reportView = new ModelAndView();
        reportView.setViewName("report.html");

        reportView.addObject("username",auth.getName());
        reportView.addObject("title","Report Portal | STEAM RMS");
        reportView.addObject("activeNavItem","reports");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        reportView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        reportView.addObject("loggedInDesignationName",loggedInDesignationName);
        reportView.addObject("loggedInImage",imageSrc);
        return reportView;
    }

    @GetMapping(value = "/Daily-Income")
    public ModelAndView dailyIncomeUI(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView reportView = new ModelAndView();
        reportView.setViewName("dailyIncome.html");

        reportView.addObject("username",auth.getName());
        reportView.addObject("title","Daily Income | STEAM RMS");
        reportView.addObject("activeNavItem","dailyIncome");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        reportView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        reportView.addObject("loggedInDesignationName",loggedInDesignationName);
        reportView.addObject("loggedInImage",imageSrc);
        return reportView;
    }

    @GetMapping(value = "/Monthly-Income")
    public ModelAndView monthlyIncomeUI(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView reportView = new ModelAndView();
        reportView.setViewName("monthlyIncome.html");

        reportView.addObject("username",auth.getName());
        reportView.addObject("title","Monthly Income | STEAM RMS");
        reportView.addObject("activeNavItem","monthlyIncome");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        reportView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        reportView.addObject("loggedInDesignationName",loggedInDesignationName);
        reportView.addObject("loggedInImage",imageSrc);
        return reportView;
    }

    @GetMapping(value = "/Income-Report")
    public ModelAndView incomeReportUI(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView reportView = new ModelAndView();
        reportView.setViewName("incomeReport.html");

        reportView.addObject("username",auth.getName());
        reportView.addObject("title","Income Report | STEAM RMS");
        reportView.addObject("activeNavItem","incomeReport");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        reportView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        reportView.addObject("loggedInDesignationName",loggedInDesignationName);
        reportView.addObject("loggedInImage",imageSrc);
        return reportView;
    }

    @GetMapping(value = "/Due-Report")
    public ModelAndView dueReportUI(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView reportView = new ModelAndView();
        reportView.setViewName("dueReport.html");

        reportView.addObject("username",auth.getName());
        reportView.addObject("title","Due Report | STEAM RMS");
        reportView.addObject("activeNavItem","dueReport");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        reportView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        reportView.addObject("loggedInDesignationName",loggedInDesignationName);
        reportView.addObject("loggedInImage",imageSrc);
        return reportView;
    }

    @GetMapping(value = "/Student-Report")
    public ModelAndView studentReportUI(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView reportView = new ModelAndView();
        reportView.setViewName("studentReport.html");

        reportView.addObject("username",auth.getName());
        reportView.addObject("title","Student Report | STEAM RMS");
        reportView.addObject("activeNavItem","studentInfo");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        reportView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        reportView.addObject("loggedInDesignationName",loggedInDesignationName);
        reportView.addObject("loggedInImage",imageSrc);
        return reportView;
    }

    @GetMapping(value = "/Batch-Report")
    public ModelAndView batchReportUI(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView reportView = new ModelAndView();
        reportView.setViewName("batchReport.html");

        reportView.addObject("username",auth.getName());
        reportView.addObject("title","Batch Report | STEAM RMS");
        reportView.addObject("activeNavItem","batchInfo");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        reportView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        reportView.addObject("loggedInDesignationName",loggedInDesignationName);
        reportView.addObject("loggedInImage",imageSrc);
        return reportView;
    }

    @GetMapping(value = "/Attendance-Report")
    public ModelAndView attendanceReportUI(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView reportView = new ModelAndView();
        reportView.setViewName("attendanceReport.html");

        reportView.addObject("username",auth.getName());
        reportView.addObject("title","Attendance Report | STEAM RMS");
        reportView.addObject("activeNavItem","attendance");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        reportView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        reportView.addObject("loggedInDesignationName",loggedInDesignationName);
        reportView.addObject("loggedInImage",imageSrc);
        return reportView;
    }

    @GetMapping(value = "/Mark-Report")
    public ModelAndView markReportUI(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView reportView = new ModelAndView();
        reportView.setViewName("attendanceReport.html");

        reportView.addObject("username",auth.getName());
        reportView.addObject("title","Attendance Report | STEAM RMS");
        reportView.addObject("activeNavItem","attendance");

        String loggedInEmployeeName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getFullName();
        String loggedInDesignationName = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getDesignationID().getDesignation();
        byte[] photoBytes = userDAO.getUserByUsername(auth.getName()).getEmployeeID().getPhotoPath();
        String base64Image = Base64.getEncoder().encodeToString(photoBytes);
        String imageSrc = "data:image/png;base64," + base64Image;
        reportView.addObject("loggedInEmployeeName",loggedInEmployeeName);
        reportView.addObject("loggedInDesignationName",loggedInDesignationName);
        reportView.addObject("loggedInImage",imageSrc);
        return reportView;
    }


}
