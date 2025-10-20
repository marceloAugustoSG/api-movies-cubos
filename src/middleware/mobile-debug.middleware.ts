import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MobileDebugMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const timestamp = new Date().toISOString();
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const origin = req.headers.origin || 'No Origin';
    const ip = req.ip || req.connection.remoteAddress;
    
    const isMobile = this.detectMobile(userAgent);
    const deviceType = isMobile ? '📱 MOBILE' : '💻 DESKTOP';
    
    console.log(`${deviceType} ${timestamp} - ${req.method} ${req.path}`);
    console.log(`   Origin: ${origin}`);
    console.log(`   IP: ${ip}`);
    console.log(`   User-Agent: ${userAgent.substring(0, 80)}...`);
    
    if (req.path === '/auth/login') {
      console.log(`🔐 LOGIN ATTEMPT - ${deviceType}`);
      console.log(`   Email: ${req.body?.email || 'N/A'}`);
      console.log(`   Origin: ${origin}`);
      console.log(`   Headers: ${JSON.stringify(req.headers, null, 2)}`);
    }
    
    res.setHeader('X-Debug-Timestamp', timestamp);
    res.setHeader('X-Debug-Device-Type', isMobile ? 'mobile' : 'desktop');
    res.setHeader('X-Debug-Origin', origin);
    
    next();
  }
  
  private detectMobile(userAgent: string): boolean {
    const mobileKeywords = [
      'Mobile', 'Android', 'iPhone', 'iPad', 'iPod',
      'BlackBerry', 'Windows Phone', 'Opera Mini',
      'IEMobile', 'Mobile Safari'
    ];
    
    return mobileKeywords.some(keyword => 
      userAgent.toLowerCase().includes(keyword.toLowerCase())
    );
  }
}
