package com.kwanii.init;

import com.kwanii.config.WebConfig;
import com.kwanii.filter.RedirectSecureFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import javax.servlet.Filter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;

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

    // Register Servlet filter (Global)
    @Override
    protected Filter[] getServletFilters() {
        return new Filter[] {
            new RedirectSecureFilter()
        };
    }
}
