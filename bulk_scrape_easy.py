#!/usr/bin/env python3
"""
Bulk LeetCode Easy Problems Scraper
Scrapes ALL easy problems from LeetCode and saves them as JSON files.
"""

import os
import json
from datetime import datetime
from leetcode_scraper import LeetCodeScraper

def main():
    print("🚀🚀🚀 BULK LEETCODE EASY PROBLEMS SCRAPER 🚀🚀🚀")
    print("=" * 70)
    print("This script will scrape ALL easy problems from LeetCode")
    print("and save them as JSON files for database import!")
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
        print("SCRAPING ALL EASY PROBLEMS")
        print("=" * 50)
        
        all_problems = scraper.get_all_easy_problems()
        
        if not all_problems:
            print("❌ No problems were scraped successfully!")
            return
        
        print(f"\n🎉 Successfully scraped {len(all_problems)} problems!")
        
        # Create output directory
        output_dir = "scraped_problems"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"📁 Created directory: {output_dir}")
        
        # Save each problem as a JSON file
        print(f"\n💾 Saving {len(all_problems)} problems as JSON files...")
        
        saved_count = 0
        failed_count = 0
        
        for i, problem in enumerate(all_problems, 1):
            try:
                # Create filename
                safe_slug = problem.slug.replace('/', '_').replace('\\', '_')
                filename = f"{output_dir}/leetcode_{safe_slug}_{problem.problem_id}.json"
                
                # Convert to dict
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
                
                # Save to JSON file
                with open(filename, 'w', encoding='utf-8') as f:
                    json.dump(problem_dict, f, indent=2, ensure_ascii=False)
                
                print(f"[{i}/{len(all_problems)}] ✅ Saved: {problem.title}")
                saved_count += 1
                
            except Exception as e:
                failed_count += 1
                print(f"[{i}/{len(all_problems)}] ❌ Error saving {problem.title}: {e}")
                continue
        
        # Final statistics
        print(f"\n🎉 BULK SCRAPING COMPLETE!")
        print("=" * 70)
        print(f"📊 FINAL STATISTICS:")
        print(f"   🎯 Total problems scraped: {len(all_problems)}")
        print(f"   ✅ Successfully saved as JSON: {saved_count}")
        print(f"   ❌ Failed to save: {failed_count}")
        print(f"   📈 Save success rate: {(saved_count/len(all_problems))*100:.1f}%")
        print(f"   📁 Files saved in: {output_dir}/")
        
        print(f"\n🚀 NEXT STEP: Import all problems into database:")
        print(f"   Run this command to import all problems:")
        print(f"   for file in {output_dir}/*.json; do node scripts/store-daily-problem.js \"$file\"; done")
        print("=" * 70)
        
    except KeyboardInterrupt:
        print("\n🛑 Bulk scraping interrupted by user")
    except Exception as e:
        print(f"❌ Unexpected error during bulk scraping: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 