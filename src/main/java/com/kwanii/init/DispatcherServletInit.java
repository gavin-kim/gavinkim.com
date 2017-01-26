package com.kwanii.init;

import com.kwanii.config.WebConfig;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

// AbstractAnnotationConfigDispatcherServletInitializer creates DispatcherServlet and ContextLoaderListener
public class DispatcherServletInit extends AbstractAnnotationConfigDispatcherServletInitializer {

    // for middle-tier and data-tire
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[]{};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[]{WebConfig.class};
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }


//    @Override
//    public void onStartup(ServletContext servletContext) throws ServletException {
//        super.onStartup(servletContext);
//
//        servletContext.addListener(chatSessionListener());
//    }
//
//    // Http session listener
//    @Bean
//    public HttpSessionListener chatSessionListener() {
//        return new SessionListener();
//    }
}
