#!/usr/bin/env python3
"""
LeetCode Medium & Hard Problem Scraper
Scrapes medium and hard LeetCode problems for the main Problems section.
"""

import requests
import json
import time
import sqlite3
import os
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

class MediumHardScraper:
    """Scraper for Medium and Hard LeetCode problems"""
    
    def __init__(self):
        self.base_url = "https://leetcode.com"
        self.graphql_url = "https://leetcode.com/graphql"
        self.session = requests.Session()
        
        # Set headers to mimic a real browser
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
        })
        
        # Initialize database
        self.db_path = os.path.join('db', 'leetcode_problems.db')
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
    
    def get_problems_by_difficulty(self, difficulty: str, limit: int = 100) -> List[Dict]:
        """
        Get a list of problems by difficulty using LeetCode's GraphQL API
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
                "difficulty": difficulty.upper()
            }
        }
        
        payload = {
            "query": query,
            "variables": variables
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com/problemset/',
            'Origin': 'https://leetcode.com'
        }
        
        try:
            print(f"Fetching {difficulty} problems list...")
            response = self.session.post(self.graphql_url, json=payload, headers=headers, timeout=15)
            
            if response.status_code != 200:
                print(f"HTTP Error: {response.status_code}")
                return []
            
            data = response.json()
            
            if 'data' in data and data['data'] and 'problemsetQuestionList' in data['data']:
                problems = data['data']['problemsetQuestionList']['questions']
                # Filter out paid problems
                free_problems = [p for p in problems if not p.get('paidOnly', True)]
                print(f"Found {len(free_problems)} free {difficulty} problems")
                return free_problems
            else:
                print("No problems found in response")
                return []
                
        except Exception as e:
            print(f"Error fetching {difficulty} problems: {e}")
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
            time.sleep(0.5)  # Rate limiting
            
            headers = {
                'Content-Type': 'application/json',
                'Referer': f'https://leetcode.com/problems/{title_slug}/',
                'Origin': 'https://leetcode.com'
            }
            
            response = self.session.post(self.graphql_url, json=payload, headers=headers, timeout=15)
            
            if response.status_code != 200:
                print(f"HTTP Error: {response.status_code}")
                return None
            
            data = response.json()
            
            if 'data' in data and data['data'] and 'question' in data['data']:
                question_data = data['data']['question']
                if question_data:
                    return self._parse_problem_data(question_data)
            
            return None
            
        except Exception as e:
            print(f"Error fetching problem details: {e}")
            return None
    
    def _parse_problem_data(self, question_data: Dict) -> LeetCodeProblem:
        """Parse the raw question data into a LeetCodeProblem object"""
        content = question_data.get('content', '')
        clean_content = self._clean_html(content)
        
        return LeetCodeProblem(
            title=question_data.get('title', ''),
            slug=question_data.get('titleSlug', ''),
            difficulty=question_data.get('difficulty', ''),
            description=clean_content,
            examples=self._extract_examples(content),
            constraints=self._extract_constraints(content),
            problem_id=int(question_data.get('questionFrontendId', 0)),
            url=f"https://leetcode.com/problems/{question_data.get('titleSlug', '')}/",
            scraped_at=datetime.now().isoformat()
        )
    
    def _extract_examples(self, content: str) -> List[str]:
        """Extract examples from problem content"""
        examples = []
        
        # Look for example patterns
        example_pattern = r'<strong[^>]*>Example[^:]*:</strong>(.*?)(?=<strong[^>]*>(?:Example|Constraints|Note)|$)'
        matches = re.findall(example_pattern, content, re.DOTALL | re.IGNORECASE)
        
        for match in matches:
            clean_example = self._clean_html(match).strip()
            if clean_example:
                examples.append(clean_example)
        
        return examples if examples else ["No examples available"]
    
    def _extract_constraints(self, content: str) -> List[str]:
        """Extract constraints from problem content"""
        constraints = []
        
        # Look for constraints section
        constraints_pattern = r'<strong[^>]*>Constraints:</strong>(.*?)(?=<strong[^>]*>|$)'
        match = re.search(constraints_pattern, content, re.DOTALL | re.IGNORECASE)
        
        if match:
            constraints_text = match.group(1)
            # Split by common constraint delimiters
            constraint_lines = re.split(r'<br\s*/?>', constraints_text)
            
            for line in constraint_lines:
                clean_constraint = self._clean_html(line).strip()
                if clean_constraint and len(clean_constraint) > 3:
                    constraints.append(clean_constraint)
        
        return constraints if constraints else ["No constraints specified"]
    
    def _clean_html(self, html_content: str) -> str:
        """Clean HTML tags and entities from content"""
        if not html_content:
            return ""
        
        # Remove HTML tags
        clean_text = re.sub(r'<[^>]+>', '', html_content)
        
        # Replace HTML entities
        clean_text = clean_text.replace('&nbsp;', ' ')
        clean_text = clean_text.replace('&lt;', '<')
        clean_text = clean_text.replace('&gt;', '>')
        clean_text = clean_text.replace('&amp;', '&')
        clean_text = clean_text.replace('&quot;', '"')
        
        # Clean up whitespace
        clean_text = re.sub(r'\s+', ' ', clean_text)
        clean_text = clean_text.strip()
        
        return clean_text
    
    def save_to_database(self, problem: LeetCodeProblem):
        """Save problem to SQLite database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Insert problem
            cursor.execute("""
                INSERT OR REPLACE INTO problems 
                (problem_id, title, slug, difficulty, description, url, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            """, (
                problem.problem_id,
                problem.title,
                problem.slug,
                problem.difficulty,
                problem.description,
                problem.url
            ))
            
            # Delete existing examples and constraints
            cursor.execute("DELETE FROM examples WHERE problem_id = ?", (problem.problem_id,))
            cursor.execute("DELETE FROM constraints WHERE problem_id = ?", (problem.problem_id,))
            
            # Insert examples
            for order, example in enumerate(problem.examples):
                cursor.execute("""
                    INSERT INTO examples (problem_id, example_text, example_order)
                    VALUES (?, ?, ?)
                """, (problem.problem_id, example, order))
            
            # Insert constraints
            for order, constraint in enumerate(problem.constraints):
                cursor.execute("""
                    INSERT INTO constraints (problem_id, constraint_text, constraint_order)
                    VALUES (?, ?, ?)
                """, (problem.problem_id, constraint, order))
            
            conn.commit()
            conn.close()
            print(f"✅ Saved problem: {problem.title}")
            
        except Exception as e:
            print(f"❌ Error saving problem to database: {e}")
    
    def scrape_difficulty(self, difficulty: str, max_problems: int = 50):
        """Scrape problems of a specific difficulty"""
        print(f"\n🎯 Starting to scrape {difficulty} problems...")
        
        # Get problems list
        problems_list = self.get_problems_by_difficulty(difficulty, limit=max_problems)
        
        if not problems_list:
            print(f"No {difficulty} problems found")
            return
        
        print(f"Found {len(problems_list)} {difficulty} problems to scrape")
        
        success_count = 0
        for i, problem_info in enumerate(problems_list):
            title_slug = problem_info['titleSlug']
            
            print(f"\n[{i+1}/{len(problems_list)}] Processing: {title_slug}")
            
            # Get detailed problem information
            problem = self.get_problem_details(title_slug)
            
            if problem:
                # Save to database
                self.save_to_database(problem)
                success_count += 1
            else:
                print(f"❌ Failed to get details for: {title_slug}")
            
            # Rate limiting
            time.sleep(1)
        
        print(f"\n✅ Successfully scraped {success_count}/{len(problems_list)} {difficulty} problems")

def main():
    """Main function to scrape medium and hard problems"""
    scraper = MediumHardScraper()
    
    print("🚀 Starting Medium & Hard LeetCode Problem Scraper")
    print("=" * 50)
    
    # Scrape Medium problems
    scraper.scrape_difficulty("MEDIUM", max_problems=30)
    
    # Small delay between difficulties
    time.sleep(2)
    
    # Scrape Hard problems
    scraper.scrape_difficulty("HARD", max_problems=20)
    
    print("\n🎉 Scraping completed!")
    print("Check your database for the new problems.")

if __name__ == "__main__":
    main() 