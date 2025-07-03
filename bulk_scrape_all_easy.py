#!/usr/bin/env python3
"""
Bulk LeetCode Easy Problems Scraper
Scrapes ALL easy problems from LeetCode and stores them in the database.
"""

import os
import sys
import json
from leetcode_scraper import LeetCodeScraper
from scripts.store_daily_problem_py import ProblemStore

def main():
    print("🚀🚀🚀 BULK LEETCODE EASY PROBLEMS SCRAPER 🚀🚀🚀")
    print("=" * 70)
    print("This script will scrape ALL easy problems from LeetCode")
    print("and store them in your database for the Junior Developer track!")
    print("=" * 70)
    
    # Ask for confirmation
    response = input("\n⚠️  This may take a while and make many API calls. Continue? (y/N): ").strip().lower()
    if response not in ['y', 'yes']:
        print("❌ Operation cancelled by user.")
        return
    
    print("\n🔥 LET'S GO! Starting the bulk scraping process...")
    
    # Initialize scraper
    scraper = LeetCodeScraper()
    
    try:
        # Scrape all easy problems
        print("\n" + "=" * 50)
        print("PHASE 1: SCRAPING ALL EASY PROBLEMS")
        print("=" * 50)
        
        all_problems = scraper.get_all_easy_problems()
        
        if not all_problems:
            print("❌ No problems were scraped successfully!")
            return
        
        print(f"\n🎉 Successfully scraped {len(all_problems)} problems!")
        
        # Store all problems in database
        print("\n" + "=" * 50)
        print("PHASE 2: STORING IN DATABASE")
        print("=" * 50)
        
        # Initialize database store
        store = ProblemStore()
        
        stored_count = 0
        failed_count = 0
        
        for i, problem in enumerate(all_problems, 1):
            try:
                print(f"[{i}/{len(all_problems)}] Storing: {problem.title}")
                
                # Convert LeetCodeProblem to dict format expected by store
                problem_data = {
                    'title': problem.title,
                    'slug': problem.slug,
                    'problem_id': problem.problem_id,
                    'difficulty': problem.difficulty,
                    'description': problem.description,
                    'url': problem.url,
                    'examples': problem.examples,
                    'constraints': problem.constraints
                }
                
                store.storeProblem(problem_data)
                stored_count += 1
                print(f"   ✅ Stored successfully!")
                
            except Exception as e:
                failed_count += 1
                print(f"   ❌ Error storing {problem.title}: {e}")
                continue
        
        # Final statistics
        print(f"\n🎉 BULK SCRAPING COMPLETE!")
        print("=" * 70)
        print(f"📊 FINAL STATISTICS:")
        print(f"   🎯 Total problems scraped: {len(all_problems)}")
        print(f"   ✅ Successfully stored in DB: {stored_count}")
        print(f"   ❌ Failed to store: {failed_count}")
        print(f"   📈 Storage success rate: {(stored_count/len(all_problems))*100:.1f}%")
        
        # Show database stats
        db_stats = store.getStats()
        print(f"\n📚 CURRENT DATABASE STATS:")
        print(f"   📊 Total Problems: {db_stats['totalProblems']}")
        print(f"   🟢 Easy Problems: {db_stats['easyProblems']}")
        print(f"   📅 Daily Problems Tracked: {db_stats['dailyProblems']}")
        
        store.close()
        
        print("\n🎉 SUCCESS! Your Junior Developer track is now loaded with")
        print(f"   {stored_count} easy LeetCode problems ready to practice!")
        print("=" * 70)
        
    except KeyboardInterrupt:
        print("\n🛑 Bulk scraping interrupted by user")
    except Exception as e:
        print(f"❌ Unexpected error during bulk scraping: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 