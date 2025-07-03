#!/usr/bin/env python3
"""
LeetCode Daily Problem Scraper
Scrapes easy LeetCode problems for the Junior section of the website.
"""

import requests
import json
import random
import time
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime
import re

@dataclass
class LeetCodeProblem:
    """Data class to represent a LeetCode problem"""
    title: str
    slug: str
    difficulty: str
    description: str
    examples: List[str]
    constraints: List[str]
    problem_id: int
    url: str
    scraped_at: str

class LeetCodeScraper:
    """Scraper for LeetCode problems"""
    
    def __init__(self):
        self.base_url = "https://leetcode.com"
        self.graphql_url = "https://leetcode.com/graphql"
        self.session = requests.Session()
        
        # Set headers to mimic a real browser
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate',  # Removed 'br' to avoid brotli compression issues
            'DNT': '1',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
        })
        
        # Initialize session by visiting the main page
        self._initialize_session()
    
    def _initialize_session(self):
        """Initialize session by visiting LeetCode homepage to get cookies"""
        try:
            print("Initializing session...")
            response = self.session.get(f"{self.base_url}/problemset/", timeout=10)
            if response.status_code == 200:
                print("Session initialized successfully")
            else:
                print(f"Session initialization failed: {response.status_code}")
        except Exception as e:
            print(f"Error initializing session: {e}")
    
    def get_easy_problems_list(self, limit: int = 50) -> List[Dict]:
        """
        Get a list of easy problems using LeetCode's GraphQL API
        """
        query = """
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
          ) {
            total: totalNum
            questions: data {
              acRate
              difficulty
              freqBar
              frontendQuestionId: questionFrontendId
              isFavor
              paidOnly: isPaidOnly
              status
              title
              titleSlug
              topicTags {
                name
                id
                slug
              }
              hasSolution
              hasVideoSolution
            }
          }
        }
        """
        
        variables = {
            "categorySlug": "",
            "skip": 0,
            "limit": limit,
            "filters": {
                "difficulty": "EASY"
            }
        }
        
        payload = {
            "query": query,
            "variables": variables
        }
        
        # Add additional headers
        headers = {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com/problemset/',
            'Origin': 'https://leetcode.com'
        }
        
        try:
            print("Fetching easy problems list...")
            response = self.session.post(self.graphql_url, json=payload, headers=headers, timeout=15)
            
            print(f"Response status: {response.status_code}")
            
            if response.status_code != 200:
                print(f"HTTP Error: {response.status_code}")
                return []
            
            # Try to parse JSON
            try:
                data = response.json()
                print("Successfully parsed JSON response")
            except json.JSONDecodeError:
                print("Failed to parse JSON response")
                print(f"Response content type: {response.headers.get('content-type', 'unknown')}")
                return []
            
            if 'data' in data and data['data'] and 'problemsetQuestionList' in data['data']:
                problems = data['data']['problemsetQuestionList']['questions']
                # Filter out paid problems
                free_problems = [p for p in problems if not p.get('paidOnly', True)]
                print(f"Found {len(free_problems)} free easy problems")
                return free_problems
            else:
                print("No problems found in response")
                if 'errors' in data:
                    print(f"GraphQL errors: {data['errors']}")
                return []
                
        except requests.RequestException as e:
            print(f"Error fetching problems list: {e}")
            return []
        except Exception as e:
            print(f"Unexpected error: {e}")
            return []
    
    def get_problem_details(self, title_slug: str) -> Optional[LeetCodeProblem]:
        """
        Get detailed information about a specific problem
        """
        query = """
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            title
            titleSlug
            content
            difficulty
            exampleTestcases
          }
        }
        """
        
        variables = {"titleSlug": title_slug}
        payload = {
            "query": query,
            "variables": variables
        }
        
        try:
            print(f"Fetching details for problem: {title_slug}")
            time.sleep(1)  # Rate limiting
            
            # Add headers for this request too
            headers = {
                'Content-Type': 'application/json',
                'Referer': f'https://leetcode.com/problems/{title_slug}/',
                'Origin': 'https://leetcode.com'
            }
            
            response = self.session.post(self.graphql_url, json=payload, headers=headers, timeout=15)
            
            if response.status_code != 200:
                print(f"HTTP Error: {response.status_code}")
                return None
            
            try:
                data = response.json()
            except json.JSONDecodeError:
                print("Failed to parse JSON response for problem details")
                return None
            
            if 'data' in data and 'question' in data['data'] and data['data']['question']:
                question_data = data['data']['question']
                return self._parse_problem_data(question_data)
            else:
                print(f"No data found for problem: {title_slug}")
                if 'errors' in data:
                    print(f"GraphQL errors: {data['errors']}")
                return None
                
        except requests.RequestException as e:
            print(f"Error fetching problem details: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error: {e}")
            return None
    
    def _parse_problem_data(self, question_data: Dict) -> LeetCodeProblem:
        """
        Parse the raw question data into a structured format
        """
        content = question_data.get('content', '')
        
        # Extract examples from content
        examples = self._extract_examples(content)
        
        # Extract constraints from content
        constraints = self._extract_constraints(content)
        
        # Clean up the description (remove HTML tags)
        description = self._clean_html(content)
        
        return LeetCodeProblem(
            title=question_data.get('title', ''),
            slug=question_data.get('titleSlug', ''),
            difficulty=question_data.get('difficulty', ''),
            description=description,
            examples=examples,
            constraints=constraints,
            problem_id=int(question_data.get('questionFrontendId', 0)),
            url=f"{self.base_url}/problems/{question_data.get('titleSlug', '')}/",
            scraped_at=datetime.now().isoformat()
        )
    
    def _extract_examples(self, content: str) -> List[str]:
        """Extract example inputs/outputs from problem content"""
        examples = []
        
        # Look for example patterns
        example_pattern = r'<strong[^>]*>Example \d+:</strong>(.*?)(?=<strong[^>]*>Example \d+:|<strong[^>]*>Constraints:|$)'
        matches = re.findall(example_pattern, content, re.DOTALL | re.IGNORECASE)
        
        for match in matches:
            cleaned = self._clean_html(match.strip())
            if cleaned:
                examples.append(cleaned)
        
        return examples
    
    def _extract_constraints(self, content: str) -> List[str]:
        """Extract constraints from problem content"""
        constraints = []
        
        # Look for constraints section
        constraints_pattern = r'<strong[^>]*>Constraints:</strong>(.*?)(?=<strong|$)'
        match = re.search(constraints_pattern, content, re.DOTALL | re.IGNORECASE)
        
        if match:
            constraints_text = match.group(1)
            # Split by line breaks or list items
            constraint_lines = re.split(r'<br\s*/??>|<li[^>]*>|</li>', constraints_text)
            
            for line in constraint_lines:
                cleaned = self._clean_html(line.strip())
                if cleaned and len(cleaned) > 3:  # Filter out very short lines
                    constraints.append(cleaned)
        
        return constraints
    
    def _clean_html(self, html_content: str) -> str:
        """Remove HTML tags and clean up content"""
        if not html_content:
            return ""
        
        # Remove HTML tags
        clean_text = re.sub(r'<[^>]+>', '', html_content)
        
        # Clean up whitespace
        clean_text = re.sub(r'\s+', ' ', clean_text)
        clean_text = clean_text.strip()
        
        # Decode HTML entities
        clean_text = clean_text.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&')
        clean_text = clean_text.replace('&quot;', '"').replace('&#39;', "'")
        
        return clean_text
    
    def get_fallback_easy_problems(self) -> List[str]:
        """
        Fallback method with predefined easy problem slugs
        """
        return [
            "two-sum", "palindrome-number", "roman-to-integer", "longest-common-prefix",
            "valid-parentheses", "merge-two-sorted-lists", "remove-duplicates-from-sorted-array",
            "remove-element", "find-the-index-of-the-first-occurrence-in-a-string",
            "search-insert-position", "length-of-last-word", "plus-one", "add-binary",
            "sqrt-x", "climbing-stairs", "remove-duplicates-from-sorted-list",
            "merge-sorted-array", "same-tree", "symmetric-tree", "maximum-depth-of-binary-tree",
            "binary-tree-inorder-traversal", "convert-sorted-array-to-binary-search-tree",
            "balanced-binary-tree", "minimum-depth-of-binary-tree", "path-sum",
            "pascals-triangle", "best-time-to-buy-and-sell-stock", "valid-palindrome",
            "single-number", "linked-list-cycle", "intersection-of-two-linked-lists",
            "excel-sheet-column-title", "majority-element", "reverse-bits",
            "number-of-1-bits", "happy-number", "remove-linked-list-elements",
            "count-primes", "isomorphic-strings", "reverse-linked-list",
            "contains-duplicate", "contains-duplicate-ii", "invert-binary-tree",
            "power-of-two", "implement-queue-using-stacks", "palindrome-linked-list",
            "valid-anagram", "binary-tree-paths", "add-digits", "ugly-number",
            "missing-number", "first-bad-version", "move-zeroes", "word-pattern",
            "nim-game", "range-sum-query-immutable", "power-of-three"
        ]
    
    def get_all_easy_problems(self) -> List[LeetCodeProblem]:
        """
        Get ALL easy problems from LeetCode - for bulk scraping
        """
        print("🚀 Starting to scrape ALL easy LeetCode problems...")
        all_problems = []
        successful_scrapes = 0
        failed_scrapes = 0
        
        # First, get the complete list of easy problems
        print("📋 Fetching complete list of easy problems...")
        
        # Start with a large limit to get as many as possible
        batch_size = 100
        skip = 0
        all_problem_slugs = []
        
        while True:
            print(f"   📥 Fetching batch starting at {skip}...")
            batch_problems = self.get_easy_problems_list(limit=batch_size, skip=skip)
            
            if not batch_problems:
                print(f"   ✅ No more problems found. Total found: {len(all_problem_slugs)}")
                break
                
            # Extract slugs from this batch
            batch_slugs = [p['titleSlug'] for p in batch_problems]
            all_problem_slugs.extend(batch_slugs)
            
            print(f"   📊 Found {len(batch_problems)} problems in this batch (Total: {len(all_problem_slugs)})")
            
            # If we got fewer than the batch size, we've reached the end
            if len(batch_problems) < batch_size:
                break
                
            skip += batch_size
            
            # Add a small delay to be respectful
            time.sleep(0.5)
        
        print(f"\n🎯 Total easy problems found: {len(all_problem_slugs)}")
        print("=" * 60)
        print("🔄 Now fetching detailed information for each problem...")
        print("=" * 60)
        
        # Now get detailed information for each problem
        for i, slug in enumerate(all_problem_slugs, 1):
            try:
                print(f"[{i}/{len(all_problem_slugs)}] Scraping: {slug}")
                
                problem_details = self.get_problem_details(slug)
                
                if problem_details:
                    all_problems.append(problem_details)
                    successful_scrapes += 1
                    print(f"   ✅ Success: {problem_details.title}")
                else:
                    failed_scrapes += 1
                    print(f"   ❌ Failed to get details for: {slug}")
                
                # Add delay to avoid rate limiting
                time.sleep(1.5)  # Be more respectful with API calls
                
                # Progress update every 10 problems
                if i % 10 == 0:
                    print(f"\n📈 Progress: {i}/{len(all_problem_slugs)} processed")
                    print(f"   ✅ Successful: {successful_scrapes}")
                    print(f"   ❌ Failed: {failed_scrapes}")
                    print(f"   📊 Success rate: {(successful_scrapes/i)*100:.1f}%")
                    print("-" * 40)
                
            except KeyboardInterrupt:
                print(f"\n🛑 Scraping interrupted by user at problem {i}")
                break
            except Exception as e:
                failed_scrapes += 1
                print(f"   ❌ Error scraping {slug}: {e}")
                continue
        
        print(f"\n🎉 SCRAPING COMPLETE!")
        print("=" * 60)
        print(f"📊 Final Statistics:")
        print(f"   🎯 Total problems attempted: {len(all_problem_slugs)}")
        print(f"   ✅ Successfully scraped: {successful_scrapes}")
        print(f"   ❌ Failed: {failed_scrapes}")
        print(f"   📈 Success rate: {(successful_scrapes/len(all_problem_slugs))*100:.1f}%")
        print("=" * 60)
        
        return all_problems

    def get_easy_problems_list(self, limit: int = 50, skip: int = 0) -> List[Dict]:
        """
        Get a list of easy problems using LeetCode's GraphQL API
        Updated to support pagination with skip parameter
        """
        query = """
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
          ) {
            total: totalNum
            questions: data {
              acRate
              difficulty
              freqBar
              frontendQuestionId: questionFrontendId
              isFavor
              paidOnly: isPaidOnly
              status
              title
              titleSlug
              topicTags {
                name
                id
                slug
              }
              hasSolution
              hasVideoSolution
            }
          }
        }
        """
        
        variables = {
            "categorySlug": "",
            "skip": skip,
            "limit": limit,
            "filters": {
                "difficulty": "EASY"
            }
        }
        
        payload = {
            "query": query,
            "variables": variables
        }
        
        # Add additional headers
        headers = {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com/problemset/',
            'Origin': 'https://leetcode.com'
        }
        
        try:
            response = self.session.post(self.graphql_url, json=payload, headers=headers, timeout=15)
            
            if response.status_code != 200:
                print(f"HTTP Error: {response.status_code}")
                return []
            
            # Try to parse JSON
            try:
                data = response.json()
            except json.JSONDecodeError:
                print("Failed to parse JSON response")
                print(f"Response content type: {response.headers.get('content-type', 'unknown')}")
                return []
            
            if 'data' in data and data['data'] and 'problemsetQuestionList' in data['data']:
                problems = data['data']['problemsetQuestionList']['questions']
                # Filter out paid problems
                free_problems = [p for p in problems if not p.get('paidOnly', True)]
                return free_problems
            else:
                if 'errors' in data:
                    print(f"GraphQL errors: {data['errors']}")
                return []
                
        except requests.RequestException as e:
            print(f"Error fetching problems list: {e}")
            return []
        except Exception as e:
            print(f"Unexpected error: {e}")
            return []

    def get_random_easy_problem(self) -> Optional[LeetCodeProblem]:
        """
        Get a random easy problem - main method for daily use
        """
        print("Starting to scrape a random easy LeetCode problem...")
        
        # Try GraphQL API first
        problems_list = self.get_easy_problems_list(100)
        
        if problems_list:
            # Select a random problem
            random_problem = random.choice(problems_list)
            title_slug = random_problem['titleSlug']
            print(f"Selected problem: {random_problem['title']} (ID: {random_problem['frontendQuestionId']})")
        else:
            # Fallback to predefined list
            print("GraphQL API failed, using fallback method...")
            fallback_problems = self.get_fallback_easy_problems()
            title_slug = random.choice(fallback_problems)
            print(f"Selected fallback problem: {title_slug}")
        
        # Get detailed information
        problem_details = self.get_problem_details(title_slug)
        
        if problem_details:
            print(f"Successfully scraped problem: {problem_details.title}")
            return problem_details
        else:
            print("Failed to get problem details")
            return None
    
    def save_problem_to_json(self, problem: LeetCodeProblem, filename: str = None) -> str:
        """
        Save problem data to JSON file
        """
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"leetcode_problem_{timestamp}.json"
        
        problem_dict = {
            'title': problem.title,
            'slug': problem.slug,
            'difficulty': problem.difficulty,
            'description': problem.description,
            'examples': problem.examples,
            'constraints': problem.constraints,
            'problem_id': problem.problem_id,
            'url': problem.url,
            'scraped_at': problem.scraped_at
        }
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(problem_dict, f, indent=2, ensure_ascii=False)
            
            print(f"Problem saved to: {filename}")
            return filename
        except Exception as e:
            print(f"Error saving to file: {e}")
            return ""

def main():
    """
    Main function to test the scraper
    """
    print("🚀 LeetCode Scraper Starting...")
    print("=" * 50)
    
    scraper = LeetCodeScraper()
    
    try:
        # Get a random easy problem
        problem = scraper.get_random_easy_problem()
        
        if problem:
            print("\n" + "=" * 50)
            print("✅ SUCCESS! Problem scraped successfully:")
            print("=" * 50)
            print(f"📝 Title: {problem.title}")
            print(f"🔢 ID: {problem.problem_id}")
            print(f"⚡ Difficulty: {problem.difficulty}")
            print(f"🔗 URL: {problem.url}")
            print(f"📄 Description length: {len(problem.description)} characters")
            print(f"📚 Examples found: {len(problem.examples)}")
            print(f"📋 Constraints found: {len(problem.constraints)}")
            
            # Show first 200 characters of description
            if problem.description:
                print(f"\n📖 Description preview:")
                print("-" * 30)
                print(problem.description[:200] + "..." if len(problem.description) > 200 else problem.description)
            
            # Show examples
            if problem.examples:
                print(f"\n🔍 Examples:")
                print("-" * 30)
                for i, example in enumerate(problem.examples[:2], 1):  # Show first 2 examples
                    print(f"Example {i}: {example[:100]}..." if len(example) > 100 else f"Example {i}: {example}")
            
            # Save to JSON file
            filename = scraper.save_problem_to_json(problem)
            if filename:
                print(f"\n💾 Data saved to: {filename}")
            
            print("\n🎉 Scraper test completed successfully!")
            
        else:
            print("❌ Failed to scrape problem")
            
    except KeyboardInterrupt:
        print("\n🛑 Scraper stopped by user")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    main() 