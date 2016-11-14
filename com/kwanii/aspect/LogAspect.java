package com.kwanii.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Aspect
public class LogAspect {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Pointcut("execution(* com.kwan.controller.*.*(..))")
    public void alertService() {}

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
            System.out.println("Pre: " + pjp.getSignature());

            Object result = pjp.proceed();

            System.out.println("Post: " + pjp + "\nResult: " + result);

            return result;

        } catch (Throwable throwable) {
            throwable.printStackTrace();
            return throwable;
        }
    }
}
