#!/bin/bash

# This script fixes all Stellar tool handlers in message.tsx

FILE="components/message.tsx"

echo "Fixing deployment tool handlers..."

# Fix deployToken handler
perl -i -p0e 's/if \(type === "tool-deployToken"\) \{[^}]*if \("toolCallId" in part && "state" in part\) \{[^}]*const \{ toolCallId, state \} = part;[^}]*if \(state === "input-available"\) \{[^}]*return \([^}]*<div key=\{toolCallId\}>[^}]*<ToolCallLoader loadingMessage="Preparing token deployment\.\.\." \/>[^}]*<\/div>[^}]*\);[^}]*\}[^}]*if \(state === "output-available" && "output" in part\) \{[^}]*const \{ output \} = part;[^}]*return \([^}]*<div key=\{toolCallId\}>[^}]*<TokenDeployForm \{\.\.\.output\.data\} \/>[^}]*<\/div>[^}]*\);[^}]*\}[^}]*\}[^}]*\}/if (type === "tool-deployToken") {
                if ("toolCallId" in part && "state" in part) {
                  const { toolCallId, state } = part;
                  if (state === "input-available") {
                    return (
                      <div key={toolCallId}>
                        <ToolCallLoader loadingMessage="Preparing token deployment..." \/>
                      <\/div>
                    );
                  }
                  if (state === "output-available" && "output" in part) {
                    const { output } = part;
                    if (output.success && output.transaction) {
                      return (
                        <div key={toolCallId}>
                          <StellarTransactionWrapper
                            transactionData={output.transaction}
                            buttonText="Deploy Token"
                          >
                            <div className="space-y-2 p-4 border border-purple-500\/50 rounded-lg bg-purple-500\/5">
                              <h3 className="text-lg font-semibold">Token Deployment Ready<\/h3>
                              <p className="text-sm text-gray-400">{output.message}<\/p>
                            <\/div>
                          <\/StellarTransactionWrapper>
                        <\/div>
                      );
                    }
                    if (!output.success) {
                      return (
                        <div key={toolCallId} className="text-red-500 p-4 border border-red-500\/50 rounded-lg bg-red-500\/5">
                          <p className="font-semibold">Deployment Failed<\/p>
                          <p className="text-sm">{output.error || output.message}<\/p>
                        <\/div>
                      );
                    }
                  }
                }
              }/gs' "$FILE"

echo "Script created but complex replacements need manual intervention"
echo "Please use the comprehensive approach with Read/Edit tools"
