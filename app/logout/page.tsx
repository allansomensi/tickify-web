"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Text } from "@radix-ui/themes";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    }
    logout();
  }, [router]);

  return (
    <Flex justify={"center"} align={"center"} className="min-h-screen">
      <Text size={"4"}>Logging out...</Text>
    </Flex>
  );
}
