package com.gavinkim.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Aspect
public class LogAspect {

    private Logger logger = LoggerFactory.getLogger(LogAspect.class);

    @Pointcut("execution(* com.gavinkim.controller.*.*(..))")
    public void alertService() {
    }

    @Around("alertService()")
    public Object watchAlertService(ProceedingJoinPoint pjp) {
        /*
         * JoinPint provides:
         * getArgs(): method args
         * getThis(): a proxy object
         * getTarget(): a target object
         * getSignature(): a description of the method (toString() returns this)
         *
         * NOTE: pjp.proceed() returns will result that the method actually returns.
         *       that must return back.
         */
        try {
            logger.debug("Pre: " + pjp.getSignature());

            Object result = pjp.proceed();

            logger.debug("Post: " + pjp + "\nResult: " + result);

            return result;

        } catch (Throwable throwable) {
            logger.debug("Exception", throwable);
            return throwable;
        }
    }
}
