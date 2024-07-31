package lk.steam.rms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfig {

    //password encrypt instance
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/login").permitAll()
                            .requestMatchers("/Reset-Password/**").permitAll()
                            .requestMatchers("/CreateAdmin").permitAll()
                            .requestMatchers("/Employee/**").hasAnyAuthority("Admin", "Manager","Counsellor","Lecturer")
                            .requestMatchers("/User/**").hasAnyAuthority("Admin", "Manager","Counsellor","Lecturer")
                            .requestMatchers("/Administration/**").hasAnyAuthority("Admin", "Manager")
                            .requestMatchers("/error").permitAll()
                            .requestMatchers("/resources/**").permitAll()
                            .requestMatchers("/Course/**").hasAnyAuthority("Admin", "Manager", "Coordinator", "Counsellor","Lecturer")
                            .requestMatchers("/Batch/**").hasAnyAuthority("Admin", "Manager", "Coordinator", "Counsellor","Lecturer")
                            .requestMatchers("/Batch").hasAnyAuthority("Admin", "Manager", "Coordinator", "Counsellor","Lecturer")
                            .requestMatchers("/Attendance").hasAnyAuthority("Admin", "Manager", "Counsellor","Lecturer")
                            .anyRequest().authenticated();

                })
                //login handling
                .formLogin(login -> {
                    login.loginPage("/login").defaultSuccessUrl("/Dashboard", true).failureUrl("/login?error=failed").usernameParameter("username").passwordParameter("password");

                })

                //logout handling
                .logout(logout -> {
                    logout.logoutSuccessUrl("/login").logoutUrl("/logout");
                })

                //exception handling
                .exceptionHandling(exception -> {
                    exception.accessDeniedPage("/error");
                })

                //cross side reference
                .csrf(csrf -> {
                    csrf.disable();
                })
                //auto logout when no activity is detected
                .sessionManagement(session -> {
                    session.invalidSessionUrl("/login")
                            .maximumSessions(1)
                            .expiredUrl("/login");
                });

        return httpSecurity.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoderMethod() {
        bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }
}
