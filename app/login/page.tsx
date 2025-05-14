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

export default function LoginPage() {
  const router = useRouter();

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

          {/* Email input */}
          <Box mb="5">
            <Flex mb="1">
              <Text
                as="label"
                htmlFor="example-email-field"
                size="2"
                weight="bold"
              >
                Email address
              </Text>
            </Flex>
            <TextField.Root
              tabIndex={1}
              placeholder="Enter your email"
              id="example-email-field"
            />
          </Box>

          {/* Password input */}
          <Box mb="5" position="relative">
            <Flex align="baseline" justify="between" mb="1">
              <Text
                as="label"
                size="2"
                weight="bold"
                htmlFor="example-password-field"
              >
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
              id="example-password-field"
            />
          </Box>

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
            <Button tabIndex={3}>Sign in</Button>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}
