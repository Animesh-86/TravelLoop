package com.traveloop.service.interfaces;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

public interface ReceiptScannerService {
    Map<String, Object> scanReceipt(MultipartFile file);
}
