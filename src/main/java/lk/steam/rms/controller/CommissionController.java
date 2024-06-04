package lk.steam.rms.controller;

import lk.steam.rms.dao.CommissionDAO;
import lk.steam.rms.entity.Commission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Commission")
public class CommissionController {

    @Autowired
    private CommissionDAO commissionDAO;

    @GetMapping("/getCommissionByRegistrationID/{registrationID}")
    public Commission getCommissionByRegistrationID(@PathVariable Integer registrationID) {
        return commissionDAO.getCommissionByRegistrationID(registrationID);
    }

}
