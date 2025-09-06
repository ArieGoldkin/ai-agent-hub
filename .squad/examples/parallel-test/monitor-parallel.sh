#!/bin/bash
# monitor-parallel.sh - Real-time monitoring for parallel agent execution

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

while true; do
  clear
  echo "========================================"
  echo "   PARALLEL EXECUTION MONITOR"
  echo "   Time: $(date +"%Y-%m-%d %H:%M:%S")"
  echo "========================================"
  
  # Agent Status
  echo -e "\n${BLUE}📊 AGENT STATUS:${NC}"
  for i in 1 2 3; do
    if [ -f ".squad/comms/agent-$i-comm.md" ]; then
      status=$(grep "^Status:" ".squad/comms/agent-$i-comm.md" 2>/dev/null | tail -1 | cut -d: -f2 | xargs)
      task=$(grep "^Current Task:" ".squad/comms/agent-$i-comm.md" 2>/dev/null | tail -1 | cut -d: -f2 | xargs)
      
      case "$status" in
        "ACTIVE")
          echo -e "  Agent-$i: ${GREEN}● ACTIVE${NC}"
          ;;
        "BLOCKED")
          echo -e "  Agent-$i: ${YELLOW}● BLOCKED${NC}"
          ;;
        "COMPLETE")
          echo -e "  Agent-$i: ${BLUE}✓ COMPLETE${NC}"
          ;;
        *)
          echo -e "  Agent-$i: ${RED}○ IDLE${NC}"
          ;;
      esac
      
      if [ -n "$task" ]; then
        echo "    └─ $task"
      fi
    else
      echo -e "  Agent-$i: ${RED}✗ NOT INITIALIZED${NC}"
    fi
  done
  
  # Active Locks
  echo -e "\n${YELLOW}🔒 ACTIVE LOCKS:${NC}"
  lock_count=0
  for lock in .squad/locks/*.lock 2>/dev/null; do
    if [ -f "$lock" ]; then
      filename=$(basename "$lock" .lock)
      locked_by=$(grep "LOCKED_BY:" "$lock" 2>/dev/null | cut -d: -f2 | xargs)
      locked_at=$(grep "LOCKED_AT:" "$lock" 2>/dev/null | cut -d: -f2 | xargs)
      
      # Calculate lock duration
      if [ -n "$locked_at" ]; then
        lock_timestamp=$(date -d "$locked_at" +%s 2>/dev/null || date +%s)
        current_timestamp=$(date +%s)
        duration=$((current_timestamp - lock_timestamp))
        duration_min=$((duration / 60))
        
        if [ $duration_min -gt 10 ]; then
          echo -e "  ${RED}⚠${NC}  $filename → $locked_by (${RED}${duration_min}m${NC})"
        else
          echo "  • $filename → $locked_by (${duration_min}m)"
        fi
      else
        echo "  • $filename → $locked_by"
      fi
      ((lock_count++))
    fi
  done
  
  if [ $lock_count -eq 0 ]; then
    echo "  No active locks"
  fi
  
  # File Progress
  echo -e "\n${GREEN}📁 FILE CREATION PROGRESS:${NC}"
  frontend_count=$(find frontend -type f 2>/dev/null | wc -l)
  backend_count=$(find backend -type f 2>/dev/null | wc -l)
  ml_count=$(find ml -type f 2>/dev/null | wc -l)
  shared_count=$(find shared -type f 2>/dev/null | wc -l)
  total_count=$((frontend_count + backend_count + ml_count + shared_count))
  
  echo "  Frontend: $frontend_count files"
  echo "  Backend:  $backend_count files"
  echo "  ML:       $ml_count files"
  echo "  Shared:   $shared_count files"
  echo "  ─────────────────"
  echo "  Total:    $total_count/14 files"
  
  # Progress Bar
  progress=$((total_count * 100 / 14))
  echo -n "  Progress: ["
  for ((i=0; i<20; i++)); do
    if [ $((i * 5)) -lt $progress ]; then
      echo -n "█"
    else
      echo -n "░"
    fi
  done
  echo "] ${progress}%"
  
  # Recent Activity
  echo -e "\n${BLUE}📝 RECENT ACTIVITY:${NC}"
  if [ -f ".squad/logs/activity.log" ]; then
    tail -3 ".squad/logs/activity.log" | sed 's/^/  /'
  else
    echo "  No recent activity"
  fi
  
  # Alerts
  echo -e "\n${RED}⚠️  ALERTS:${NC}"
  alert_count=0
  
  # Check for stale locks
  for lock in .squad/locks/*.lock 2>/dev/null; do
    if [ -f "$lock" ]; then
      locked_at=$(grep "LOCKED_AT:" "$lock" 2>/dev/null | cut -d: -f2 | xargs)
      if [ -n "$locked_at" ]; then
        lock_timestamp=$(date -d "$locked_at" +%s 2>/dev/null || date +%s)
        current_timestamp=$(date +%s)
        duration=$((current_timestamp - lock_timestamp))
        if [ $duration -gt 600 ]; then # 10 minutes
          echo -e "  ${RED}•${NC} Stale lock detected: $(basename "$lock" .lock)"
          ((alert_count++))
        fi
      fi
    fi
  done
  
  # Check for blocked agents
  for i in 1 2 3; do
    if [ -f ".squad/comms/agent-$i-comm.md" ]; then
      status=$(grep "^Status:" ".squad/comms/agent-$i-comm.md" 2>/dev/null | tail -1 | cut -d: -f2 | xargs)
      if [ "$status" = "BLOCKED" ]; then
        blocked_since=$(grep "Waiting Since:" ".squad/comms/agent-$i-comm.md" 2>/dev/null | tail -1 | cut -d: -f2)
        echo -e "  ${YELLOW}•${NC} Agent-$i blocked since $blocked_since"
        ((alert_count++))
      fi
    fi
  done
  
  if [ $alert_count -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} No alerts"
  fi
  
  # Efficiency Metrics
  if [ $total_count -gt 0 ]; then
    echo -e "\n${BLUE}📊 EFFICIENCY METRICS:${NC}"
    
    # Calculate parallel efficiency (simplified)
    if [ -f ".squad/logs/start_time" ]; then
      start_time=$(cat .squad/logs/start_time)
      current_time=$(date +%s)
      elapsed=$((current_time - start_time))
      elapsed_min=$((elapsed / 60))
      
      # Estimate sequential time (3x parallel for this test)
      sequential_estimate=$((elapsed_min * 3))
      efficiency=$((100 - (elapsed_min * 100 / sequential_estimate)))
      
      echo "  Elapsed Time: ${elapsed_min} minutes"
      echo "  Est. Sequential: ${sequential_estimate} minutes"
      echo "  Parallel Efficiency: ${efficiency}%"
    else
      # Initialize start time
      date +%s > .squad/logs/start_time
    fi
  fi
  
  echo -e "\n────────────────────────────────────────"
  echo "Press Ctrl+C to exit"
  
  sleep 5
done