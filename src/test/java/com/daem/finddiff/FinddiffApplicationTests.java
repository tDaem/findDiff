package com.daem.finddiff;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class FinddiffApplicationTests {

    @Test
    void contextLoads() {
        Integer a = 1001;
        System.out.println(Integer.toBinaryString(1001));
    }

    public static void main(String[] args) {
        int i = 1001;
        System.out.println((byte)((i >> 24) & 0xff));
        System.out.println((byte)((i >> 16) & 0xff));
        System.out.println((byte)((i >> 8) & 0xff));
        System.out.println((byte)(i & 0xff));
    }

}
