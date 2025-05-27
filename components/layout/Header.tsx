"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import Link from "next/link";
import { FileTextIcon } from "@radix-ui/react-icons";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/logout"
    ) {
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [pathname]);

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/logout"
  ) {
    return null;
  }

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed:", await res.json());
        alert("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Failed to logout:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  return (
    <Flex
      justify="between"
      align="center"
      px="6"
      py="4"
      className="border-b-2 border-gray-800 bg-gray-900"
    >
      <Link href="/">
        <Heading size="8">Tickify</Heading>
      </Link>

      <Flex gap="4" align="center">
        <Link href="/tickets">
          <Button variant="soft" size="3">
            <FileTextIcon />
            Tickets
          </Button>
        </Link>
      </Flex>

      {user && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Box maxWidth="400px">
              <Card>
                <Flex
                  gap="4"
                  align="center"
                  px="2"
                  style={{ cursor: "pointer" }}
                >
                  <Avatar
                    size="4"
                    radius="full"
                    fallback={user.username.charAt(0).toUpperCase()}
                    color="indigo"
                  />
                  <Box>
                    <Text as="div" size="2" weight="bold">
                      {user.username}
                    </Text>
                    <Badge
                      color={
                        user.role === "admin"
                          ? "red"
                          : user.role === "moderator"
                            ? "jade"
                            : "gray"
                      }
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </Box>
                </Flex>
              </Card>
            </Box>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              shortcut="⌘ P"
              onSelect={() => router.push("/profile")}
            >
              Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item
              shortcut="⌘ S"
              onSelect={() => router.push("/settings")}
            >
              Settings
            </DropdownMenu.Item>
            {user.role === "admin" && (
              <>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  shortcut="⌘ A"
                  onSelect={() => router.push("/admin")}
                >
                  Admin Portal
                </DropdownMenu.Item>
              </>
            )}
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              shortcut="⌘ L"
              color="red"
              onSelect={handleLogout}
            >
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}
    </Flex>
  );
}
