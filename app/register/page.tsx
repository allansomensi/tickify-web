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

export default function RegisterPage() {
  const router = useRouter();

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

          {/* First Name */}
          <Box mb="4">
            <Flex mb="1">
              <Text as="label" htmlFor="first-name" size="2" weight="bold">
                First name
              </Text>
            </Flex>
            <TextField.Root
              tabIndex={1}
              placeholder="Enter your first name"
              id="first-name"
            />
          </Box>

          {/* Last Name */}
          <Box mb="4">
            <Flex mb="1">
              <Text as="label" htmlFor="last-name" size="2" weight="bold">
                Last name
              </Text>
            </Flex>
            <TextField.Root
              tabIndex={2}
              placeholder="Enter your last name"
              id="last-name"
            />
          </Box>

          {/* Email */}
          <Box mb="4">
            <Flex mb="1">
              <Text as="label" htmlFor="email" size="2" weight="bold">
                Email address
              </Text>
            </Flex>
            <TextField.Root
              tabIndex={3}
              placeholder="Enter your email"
              id="email"
              type="email"
            />
          </Box>

          {/* Username */}
          <Box mb="4">
            <Flex mb="1">
              <Text as="label" htmlFor="username" size="2" weight="bold">
                Username
              </Text>
            </Flex>
            <TextField.Root
              tabIndex={4}
              placeholder="Choose a username"
              id="username"
            />
          </Box>

          {/* Password */}
          <Box mb="4">
            <Flex mb="1">
              <Text as="label" htmlFor="password" size="2" weight="bold">
                Password
              </Text>
            </Flex>
            <TextField.Root
              tabIndex={5}
              placeholder="Create a password"
              id="password"
              type="password"
            />
          </Box>

          {/* Confirm Password */}
          <Box mb="5">
            <Flex mb="1">
              <Text
                as="label"
                htmlFor="confirm-password"
                size="2"
                weight="bold"
              >
                Confirm password
              </Text>
            </Flex>
            <TextField.Root
              tabIndex={6}
              placeholder="Confirm your password"
              id="confirm-password"
              type="password"
            />
          </Box>

          <Flex mt="6" justify="end" gap={"4"}>
            {/* Back to login */}
            <Button
              tabIndex={8}
              variant="outline"
              onClick={() => {
                router.push("/login");
              }}
            >
              Back to login
            </Button>

            {/* Submit */}
            <Button tabIndex={7}>Register</Button>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}
