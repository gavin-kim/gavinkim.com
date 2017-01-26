package com.kwanii.config;


import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.support.PersistenceAnnotationBeanPostProcessor;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

@Configuration
@PropertySource("classpath:/property/config.properties")
// Scan for any interfaces that extend JpaRepository<T, ID>
@EnableJpaRepositories(basePackages = "com.kwanii.repository.**")
public class JPAConfig implements EnvironmentAware {

    private Environment env;

    @Override
    public void setEnvironment(Environment environment) {
        env = environment;
    }

    // 1. HikariCP (pooled database source)
    @Bean
    public DataSource dataSource() {

        try {
            HikariConfig config = new HikariConfig();
            config.setDriverClassName(env.getProperty("oracle.driver-class-name"));
            config.setJdbcUrl(env.getProperty("oracle.jdbc-url"));
            config.setUsername(env.getProperty("oracle.username"));
            config.setPassword(env.getProperty("oracle.password"));
            config.addDataSourceProperty("cachePrepStmts",
                env.getProperty("oracle.cache-prep-stmts"));
            config.addDataSourceProperty("prepStmtCacheSize",
                env.getProperty("oracle.prep-stmt-cache-size"));
            config.addDataSourceProperty("prepStmtCacheSqlLimit",
                env.getProperty("oracle.prep-stmt-cache-sql-limit"));
            return new HikariDataSource(config);

        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    // 2. use Hibernate Adapter
    @Bean
    public JpaVendorAdapter jpaVendorAdapter() {
        HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        adapter.setDatabase(Database.ORACLE);
        adapter.setDatabasePlatform("org.hibernate.dialect.Oracle12cDialect");
        adapter.setShowSql(true);
        adapter.setGenerateDdl(true);
        return adapter;
    }

    // 3. EntityManagerFactory (DataSource, HibernateAdapter)
    @Bean
    public EntityManagerFactory entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean emfb =
            new LocalContainerEntityManagerFactoryBean();
        emfb.setDataSource(dataSource());
        emfb.setJpaVendorAdapter(jpaVendorAdapter());
        emfb.setPackagesToScan("com.kwanii.model.oracle");
        emfb.afterPropertiesSet();
        return emfb.getObject();
    }


    // 4. EntityManagerFactory need to be wrapped by JpaTransactionManager
    //    JpaTransactionManager binds EntityManager with a thread
    //    It allows for thread-bound EntityManager per factory
    @Bean
    public PlatformTransactionManager transactionManager() {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory());
        return transactionManager;
    }

    // Spring's PersistenceAnnotationBeanPostProcessor must be configured
    @Bean
    public PersistenceAnnotationBeanPostProcessor persistenceAnnotationBeanPostProcessor() {
        return new PersistenceAnnotationBeanPostProcessor();
    }

    // Exception Translator
    // for which exceptions should be translated into Spring's unified data-access exceptions
    @Bean
    public BeanPostProcessor persistenceTranslation() {
        return new PersistenceExceptionTranslationPostProcessor();
    }
}
