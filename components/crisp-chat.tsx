"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("fa9e064f-2c2f-4a26-8cba-eb0c4dab3e47");
    }, []);

    return null;
};