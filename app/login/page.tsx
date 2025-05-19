"use client";

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Link,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleLogin = () => {
    startTransition(async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        setError(result.error ?? "Unexpected error");
        return;
      }

      router.push("/");
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isPending) {
      handleLogin();
    }
  };

  return (
    <Flex
      justify={"center"}
      align={"center"}
      direction={"column"}
      className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900"
    >
      <Heading size={"9"} mb={"6"}>
        Tickify
      </Heading>

      <Flex flexShrink="0" gap="6" direction="column" width="416px">
        <Card size="4">
          <Heading as="h3" size="6" trim="start" mb="5">
            Sign up
          </Heading>

          {/* Username input */}
          <Box mb="5">
            <Flex mb="1">
              <Text as="label" size="2" weight="bold">
                Username
              </Text>
            </Flex>
            <TextField.Root
              tabIndex={1}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              onKeyDown={handleKeyDown}
            />
          </Box>

          {/* Password input */}
          <Box mb="5" position="relative">
            <Flex align="baseline" justify="between" mb="1">
              <Text as="label" size="2" weight="bold">
                Password
              </Text>
              <Link
                href="#"
                tabIndex={5}
                size="2"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </Link>
            </Flex>
            <TextField.Root
              tabIndex={2}
              placeholder="Enter your password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Box>

          <Flex justify={"center"}>
            {error && (
              <Text color="red" size={"2"}>
                {error}
              </Text>
            )}
          </Flex>

          {/* Buttons */}
          <Flex mt="6" justify="end" gap="3">
            <Button
              tabIndex={4}
              variant="outline"
              onClick={() => {
                router.push("/register");
              }}
            >
              Create an account
            </Button>
            <Button onClick={handleLogin} tabIndex={3} disabled={isPending}>
              {isPending ? "Loading..." : "Sign in"}
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}
