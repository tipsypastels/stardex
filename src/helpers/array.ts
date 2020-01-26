import { ReactNode } from "react";

export function toSentence(words: string[], connector = 'and') {
  if (words.length < 2) {
    return words[0];
  }
  return `${words.slice(0, -1).join(', ')} ${connector} ${words[words.length - 1]}`;
};

export function nodesToSentence(nodes: ReactNode[], connector = 'and') {
  if (nodes.length < 2) {
    return nodes[0];
  }

  const newNodes: ReactNode[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    newNodes.push(nodes[i]);
    newNodes.push(', ');
  }

  newNodes.push(connector + ' ');
  newNodes.push(nodes[nodes.length - 1]);
  return newNodes;
}