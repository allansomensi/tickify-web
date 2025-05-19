"use client";

import { startTransition, useEffect, useState } from "react";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  InfoCircledIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Card,
  DataList,
  Flex,
  Heading,
  IconButton,
  Separator,
  Skeleton,
  Text,
} from "@radix-ui/themes";

interface StatusData {
  updated_at: string;
  dependencies: {
    database: {
      version: string;
      max_connections: number;
      opened_connections: number;
    };
  };
}

export default function StatusPage() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    startTransition(async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/status");
        if (!response.ok) {
          throw new Error("Failed to fetch status");
        }
        const data = await response.json();
        setStatus(data);
        setError(null);
      } catch {
        setError("Unable to connect to the API");
      } finally {
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      height="100vh"
      className="bg-gradient-to-br from-blue-900 to-gray-900"
    >
      <Card size="4" className="min-w-[416px]">
        <Box p="5">
          <Flex justify="between" align="center" mb="3">
            <Flex align="center" gap="3">
              <Skeleton loading={isLoading}>
                <InfoCircledIcon width="28" height="28" />
              </Skeleton>
              <Skeleton loading={isLoading}>
                <Heading weight="bold" size="5">
                  System Status
                </Heading>
              </Skeleton>
            </Flex>
            <Skeleton loading={isLoading}>
              <IconButton
                variant="ghost"
                color="gray"
                onClick={fetchStatus}
                title="Refresh status"
                radius="full"
              >
                <ReloadIcon width="20" height="20" />
              </IconButton>
            </Skeleton>
          </Flex>
          <Skeleton loading={isLoading}>
            <Text as="p" size="3" color="gray" weight="medium">
              Real-time system health overview
            </Text>
          </Skeleton>
        </Box>
        <Separator size="4" />
        <Box p="6">
          {isLoading ? (
            <Box>
              <Skeleton height="28px" width="160px" mb="4" />
              <Skeleton height="18px" width="220px" mb="5" />
              <Skeleton height="26px" width="120px" mb="3" />
              <Skeleton height="22px" width="320px" mb="2" />
              <Skeleton height="22px" width="320px" mb="2" />
              <Skeleton height="22px" width="320px" />
            </Box>
          ) : error ? (
            <Flex align="center" gap="2" justify="center" mb="4">
              <Badge color="red" size="3" radius="full">
                <CrossCircledIcon width="20" height="20" />
                {error}
              </Badge>
            </Flex>
          ) : status ? (
            <Box>
              <Flex align="center" gap="2" justify="center" mb="4">
                <Badge color="jade" size="3" radius="full" mb={"2"}>
                  <CheckCircledIcon width="20" height="20" />
                  System operational
                </Badge>
              </Flex>
              <Text as="p" size="3" mb="4" color="gray">
                <Text as="span" weight="bold">
                  Last updated:{" "}
                </Text>
                {formatDate(status.updated_at)}
              </Text>
              <Text size="5" weight="bold" mb="4">
                Database
              </Text>
              <DataList.Root mt="2">
                <DataList.Item align="center">
                  <DataList.Label minWidth="140px">Version:</DataList.Label>
                  <DataList.Value>
                    {status.dependencies.database.version}
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item align="center">
                  <DataList.Label minWidth="140px">
                    Max Connections:
                  </DataList.Label>
                  <DataList.Value>
                    {status.dependencies.database.max_connections}
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item align="center">
                  <DataList.Label minWidth="140px">
                    Opened Connections:
                  </DataList.Label>
                  <DataList.Value>
                    {status.dependencies.database.opened_connections}
                  </DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </Box>
          ) : null}
        </Box>
      </Card>
    </Flex>
  );
}
