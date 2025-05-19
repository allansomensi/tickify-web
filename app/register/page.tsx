"use client";

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const fields = [
    {
      label: "First name",
      id: "firstName",
      placeholder: "Enter your first name",
      type: "text" as const,
    },
    {
      label: "Last name",
      id: "lastName",
      placeholder: "Enter your last name",
      type: "text" as const,
    },
    {
      label: "Email address",
      id: "email",
      placeholder: "Enter your email",
      type: "email" as const,
    },
    {
      label: "Username",
      id: "username",
      placeholder: "Choose a username",
      type: "text" as const,
    },
    {
      label: "Password",
      id: "password",
      placeholder: "Create a password",
      type: "password" as const,
    },
    {
      label: "Confirm password",
      id: "confirmPassword",
      placeholder: "Confirm your password",
      type: "password" as const,
    },
  ] as const;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const payload: Record<string, string> = {};
    Object.entries(form).forEach(([key, value]) => {
      if (value.trim() !== "") {
        payload[key] = value;
      }
    });

    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.error || "Registration failed.");
        return;
      }

      router.push("/login");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900"
    >
      <Heading size="9" mb="6">
        Tickify
      </Heading>

      <Flex flexShrink="0" gap="6" direction="column" width="416px">
        <Card size="4">
          <Heading as="h3" size="6" trim="start" mb="5">
            Create your account
          </Heading>

          {/* Form Fields */}
          {fields.map(({ label, id, placeholder, type }, index) => (
            <Box mb="4" key={id}>
              <Flex mb="1">
                <Text as="label" htmlFor={id} size="2" weight="bold">
                  {label}
                </Text>
              </Flex>
              <TextField.Root
                tabIndex={index + 1}
                placeholder={placeholder}
                id={id}
                type={type}
                value={form[id]}
                onChange={(e) => handleChange(id, e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Box>
          ))}

          {errorMessage && (
            <Text color="red" size="2" mb="3">
              {errorMessage}
            </Text>
          )}

          <Flex mt="6" justify="end" gap="4">
            <Button
              tabIndex={8}
              variant="outline"
              onClick={() => router.push("/login")}
            >
              Back to login
            </Button>
            <Button tabIndex={7} onClick={handleSubmit}>
              Register
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}
