#!/bin/bash

base_branch=${1:-develop}
current_branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$(git rev-list --count "$base_branch".."$current_branch")" -gt 0 ]; then
  echo "Opening pull request for $current_branch against $base_branch..."
else
  echo "❌  Current branch ($current_branch) has no commits yet. Please make at least one commit."
  exit 1
fi

remote_url=$(git config --get remote.origin.url)

if [[ "$remote_url" =~ github\.com\/(.+)\/(.+)\.git$ ]]; then
  username=${BASH_REMATCH[1]}
  repository=${BASH_REMATCH[2]}
elif [[ "$remote_url" =~ git@github\.com:(.+)\/(.+)\.git$ ]]; then
  username=${BASH_REMATCH[1]}
  repository=${BASH_REMATCH[2]}
else
  echo "❌  Unable to extract username and repository from the remote URL: $remote_url"
  exit 1
fi

if [ "$current_branch" = "$base_branch" ]; then
  echo "❌  The current branch is already the same as the base branch."
  exit 1
fi

pr_url=$(curl -s "https://api.github.com/repos/$username/$repository/pulls\?head\=$username:$current_branch\&base\=$base_branch" | grep -Eo 'https://github.com/[^\"]+' | head -n 1)

if [ -n "$pr_url" ]; then
  echo "❌  A pull request already exists for $current_branch against $base_branch: $pr_url"
  exit 1
else
  git push -u origin "$current_branch"

  if [[ "$OSTYPE" == "darwin"* ]]; then
    open "https://github.com/$username/$repository/compare/$base_branch...$current_branch?expand=1"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "https://github.com/$username/$repository/compare/$base_branch...$current_branch?expand=1"
  else
    echo "❌  Unsupported OS for automatically open the pull request creation page"
    exit 1
  fi
fi
